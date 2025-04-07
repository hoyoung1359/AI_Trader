import { KoreaInvestmentError } from '@/types/error';
import { StockResponse } from '@/types/stock';
import { supabase } from '@/lib/supabase/client';
import { ChartPeriod } from '@/types/chart';

const BASE_URL = 'https://openapi.koreainvestment.com:9443';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// 토큰 캐싱을 위한 전역 변수
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;
let tokenRequestPromise: Promise<string> | null = null; // 동시 요청 방지용

// 토큰 발급 요청 제한 관리를 위한 변수
let lastTokenRequestTime: number | null = null;
const TOKEN_REQUEST_INTERVAL = 60000; // 1분(60초)

interface KospiStock {
  mksc_shrn_iscd: string;  // 종목코드
  hts_kor_isnm: string;    // 종목명
  bstp_cls_code: string;   // 업종코드
  bstp_kor_isnm: string;   // 업종명
}

// 주요 KOSPI 종목 리스트
export const MAJOR_STOCKS = [
  { code: '005930', name: '삼성전자', sector: '전기전자' },
  { code: '000660', name: 'SK하이닉스', sector: '전기전자' },
  { code: '005935', name: '삼성전자우', sector: '전기전자' },
  { code: '005380', name: '현대차', sector: '운수장비' },
  { code: '035420', name: 'NAVER', sector: '서비스업' },
  { code: '051910', name: 'LG화학', sector: '화학' },
  { code: '005490', name: 'POSCO홀딩스', sector: '철강금속' },
  { code: '035720', name: '카카오', sector: '서비스업' },
  { code: '006400', name: '삼성SDI', sector: '전기전자' },
  { code: '068270', name: '셀트리온', sector: '의약품' },
  { code: '000270', name: '기아', sector: '운수장비' },
  { code: '105560', name: 'KB금융', sector: '금융업' },
  { code: '055550', name: '신한지주', sector: '금융업' },
  { code: '002630', name: '오리엔트바이오', sector: '의약품' },
  { code: '096770', name: 'SK이노베이션', sector: '화학' }
];

// 시가총액 상위 종목만 먼저 반환하는 함수
export async function getInitialStockList(): Promise<KospiStock[]> {
  return MAJOR_STOCKS.map(stock => ({
    mksc_shrn_iscd: stock.code,
    hts_kor_isnm: stock.name,
    bstp_cls_code: '',
    bstp_kor_isnm: stock.sector
  }));
}

// 전체 종목 리스트는 필요할 때만 호출
export async function getKospiStockList(): Promise<KospiStock[]> {
  try {
    // 먼저 주요 종목 반환
    const majorStocks = await getInitialStockList();
    
    // 전체 목록이 필요한 경우에만 API 호출
    const token = await getAccessToken();
    
    const url = new URL(`${BASE_URL}/uapi/domestic-stock/v1/quotations/kospi-quotations`);
    url.searchParams.append('servicekey', process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_KEY!);
    
    const response = await fetch(url, {
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
        appkey: process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_KEY!,
        appsecret: process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_SECRET!,
        tr_id: 'HHDFS00000300',
        custtype: 'P',
      },
    });

    const data = await response.json();
    
    if (!response.ok || data.rt_cd !== '0') {
      console.error('KOSPI List API Error:', data);
      // API 호출 실패시 주요 종목만이라도 반환
      return majorStocks;
    }

    return [...majorStocks, ...(data.output || [])];
  } catch (error) {
    console.error('Error fetching KOSPI list:', error);
    // 에러 발생시 주요 종목만이라도 반환
    return getInitialStockList();
  }
}

async function getValidTokenFromDB() {
  try {
    const { data, error } = await supabase
      .from('access_tokens')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('DB token fetch error:', error);
      return null;
    }

    return data?.token || null;
  } catch (error) {
    console.error('Error getting token from DB:', error);
    return null;
  }
}

async function saveTokenToDB(token: string) {
  try {
    // 기존 토큰들 모두 삭제
    await supabase
      .from('access_tokens')
      .delete()
      .neq('token', 'dummy');

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 23 * 60 * 60 * 1000); // 23시간 후 만료

    // 새 토큰 저장
    const { error } = await supabase
      .from('access_tokens')
      .insert([{ 
        token,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString()
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving token to DB:', error);
    throw error;
  }
}

export async function getAccessToken(): Promise<string> {
  try {
    // 이미 진행 중인 토큰 요청이 있다면 해당 Promise 반환
    if (tokenRequestPromise) {
      return tokenRequestPromise;
    }

    // 캐시된 토큰 확인
    const existingToken = await getCachedToken();
    if (existingToken) {
      return existingToken;
    }

    // 새로운 토큰 요청 Promise 생성
    tokenRequestPromise = (async () => {
      try {
        // 토큰 발급 요청 제한 체크
        if (lastTokenRequestTime && Date.now() - lastTokenRequestTime < TOKEN_REQUEST_INTERVAL) {
          const waitTime = TOKEN_REQUEST_INTERVAL - (Date.now() - lastTokenRequestTime);
          console.log(`Waiting ${Math.ceil(waitTime / 1000)}초 for token request limit...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        console.log('Requesting new token...');
        lastTokenRequestTime = Date.now();

        const response = await fetch(`${BASE_URL}/oauth2/tokenP`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            grant_type: 'client_credentials',
            appkey: process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_KEY,
            appsecret: process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_SECRET,
          }),
        });

        const data = await response.json();
        
        if (!response.ok || !data.access_token) {
          if (data.error_code === 'EGW00133') {
            // 토큰 발급 제한에 걸린 경우, 1분 후 재시도
            console.log('Token request limit reached, retrying in 1 minute...');
            await new Promise(resolve => setTimeout(resolve, TOKEN_REQUEST_INTERVAL));
            return getAccessToken();
          }
          console.error('Token API Error:', data);
          throw new Error(data.error_description || 'Failed to get access token');
        }

        // 토큰 캐싱
        cachedToken = data.access_token;
        tokenExpiry = Date.now() + (data.expires_in * 1000);
        await saveTokenToDB(data.access_token);
        
        return data.access_token;
      } finally {
        // 요청이 완료되면 Promise 초기화
        tokenRequestPromise = null;
      }
    })();

    return tokenRequestPromise;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

async function getCachedToken() {
  try {
    // 메모리에 캐시된 토큰이 있고 만료되지 않았다면 사용
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
      return cachedToken;
    }

    // DB에서 유효한 토큰 조회
    const validToken = await getValidTokenFromDB();
    if (validToken) {
      cachedToken = validToken;
      // 토큰 만료 10분 전까지만 사용
      tokenExpiry = new Date().getTime() + (23 * 60 - 10) * 60 * 1000;
      return validToken;
    }

    return null;
  } catch (error) {
    console.error('Error getting cached token:', error);
    return null;
  }
}

// API 호출 시 토큰 만료 체크 및 재시도 로직
async function fetchWithTokenRetry(url: string, options: any, retryCount = 0): Promise<Response> {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // 토큰 만료 또는 유효하지 않은 토큰
    if (data.rt_cd === '1' && (data.msg_cd === 'EGW00121' || data.msg1?.includes('token'))) {
      if (retryCount >= 2) {
        throw new Error('Max retry count exceeded');
      }

      console.log('Token invalid or expired, getting new token...');
      
      // 기존 토큰 삭제
      await supabase
        .from('access_tokens')
        .delete()
        .neq('token', 'dummy');

      const newToken = await getAccessToken();
      options.headers.authorization = `Bearer ${newToken}`;
      
      return fetchWithTokenRetry(url, options, retryCount + 1);
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: response.headers
    });
  } catch (error) {
    console.error('Error in fetchWithTokenRetry:', error);
    throw error;
  }
}

// getKospiStocks 함수 수정
export async function getKospiStocks(stockCode: string): Promise<StockResponse> {
  try {
    const token = await getAccessToken();
    
    const url = new URL(`${BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-price`);
    url.searchParams.append('FID_COND_MRKT_DIV_CODE', 'J');
    url.searchParams.append('FID_INPUT_ISCD', stockCode);
    
    const response = await fetchWithTokenRetry(url.toString(), {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
        appkey: process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_KEY!,
        appsecret: process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_SECRET!,
        tr_id: 'FHKST01010100',
        custtype: 'P',
      }
    });

    const data = await response.json();
    
    if (!response.ok || data.rt_cd !== '0') {
      console.error('Stock API Error:', data);
      throw new KoreaInvestmentError(data.msg1 || 'Failed to fetch stock data');
    }

    return data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}

interface ChartDataItem {
  stck_bsop_date: string;  // 거래일자
  stck_oprc: string;       // 시가
  stck_hgpr: string;       // 고가
  stck_lwpr: string;       // 저가
  stck_clpr: string;       // 종가
  acml_vol: string;        // 거래량
}

async function getChartFromDB(stockCode: string, period: ChartPeriod): Promise<ChartDataItem[] | null> {
  try {
    const { data, error } = await supabase
      .from('stock_charts')
      .select('chart_data')
      .eq('stock_code', stockCode)
      .eq('period', period)
      .gt('updated_at', new Date(Date.now() - 1000 * 60 * 60).toISOString()) // 1시간 이내 데이터만
      .single();

    if (error) return null;
    return data?.chart_data;
  } catch (error) {
    console.error('Error getting chart from DB:', error);
    return null;
  }
}

async function saveChartToDB(stockCode: string, period: ChartPeriod, chartData: ChartDataItem[]) {
  try {
    const { error } = await supabase
      .from('stock_charts')
      .upsert({
        stock_code: stockCode,
        period: period,
        chart_data: chartData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'stock_code_period'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving chart to DB:', error);
  }
}

interface ChartParams {
  code: string;
  period: string;
  unit?: string;
  count?: number;
  inqStrtDd?: string;
  inqEndDd?: string;
  trId: string;
}

export async function getStockChart(params: ChartParams) {
  try {
    const token = await getAccessToken();
    
    const url = new URL(`${BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice`);
    url.searchParams.append('fid_cond_mrkt_div_code', 'J');
    url.searchParams.append('fid_input_iscd', params.code);
    url.searchParams.append('fid_input_date_1', params.inqStrtDd || '');
    url.searchParams.append('fid_input_date_2', params.inqEndDd || '');
    url.searchParams.append('fid_period_div_code', params.period);
    if (params.unit) {
      url.searchParams.append('fid_input_hour_1', '0900');
      url.searchParams.append('fid_price_div_code', params.unit);
    }

    const response = await fetch(url, {
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
        appkey: process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_KEY!,
        appsecret: process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_SECRET!,
        tr_id: params.trId,
        custtype: 'P',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Chart API Error:', errorData);
      throw new KoreaInvestmentError(
        errorData.msg1 || '차트 데이터를 가져오는데 실패했습니다.',
        errorData.rt_cd
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
}

// 오늘 날짜를 YYYYMMDD 형식으로 반환
function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 기간에 따른 시작일을 YYYYMMDD 형식으로 반환
function getPeriodStartDate(period: string): string {
  const today = new Date();
  let startDate = new Date();

  switch (period) {
    case '1D':
      startDate = new Date(today);
      break;
    case '1W':
      startDate.setDate(today.getDate() - 7);
      break;
    case '1M':
      startDate.setMonth(today.getMonth() - 1);
      break;
    case '3M':
      startDate.setMonth(today.getMonth() - 3);
      break;
    case '6M':
      startDate.setMonth(today.getMonth() - 6);
      break;
    case '1Y':
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(today.getMonth() - 1); // 기본값 1개월
  }

  const year = startDate.getFullYear();
  const month = String(startDate.getMonth() + 1).padStart(2, '0');
  const day = String(startDate.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function getPeriodParams(period: ChartPeriod, stockCode: string) {
  const today = new Date();
  let startDate = new Date();

  switch (period) {
    case '1D':
      startDate = new Date(today);
      break;
    case '1W':
      startDate.setDate(today.getDate() - 7);
      break;
    case '1M':
      startDate.setMonth(today.getMonth() - 1);
      break;
    case '3M':
      startDate.setMonth(today.getMonth() - 3);
      break;
    case '6M':
      startDate.setMonth(today.getMonth() - 6);
      break;
    case '1Y':
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    case '3Y':
      startDate.setFullYear(today.getFullYear() - 3);
      break;
    case '5Y':
      startDate.setFullYear(today.getFullYear() - 5);
      break;
    default:
      startDate.setMonth(today.getMonth() - 1);
  }

  return {
    FID_COND_MRKT_DIV_CODE: 'J',
    FID_INPUT_ISCD: stockCode,
    FID_PERIOD_DIV_CODE: 'D',
    FID_ORG_ADJ_PRC: '1',
    START_DT: startDate.toISOString().slice(0, 10).replace(/-/g, ''),
    END_DT: today.toISOString().slice(0, 10).replace(/-/g, ''),
  };
} 

interface StockPrice {
  code: string;
  price: number;
  change: number;
  change_rate: number;
  volume: number;
  updated_at: string;
}

export async function getStockPricesFromDB(): Promise<StockPrice[]> {
  try {
    const { data, error } = await supabase
      .from('stock_prices')
      .select('*')
      .order('code');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching stock prices from DB:', error);
    return [];
  }
}

export async function updateStockPriceInDB(stockData: {
  code: string;
  price: number;
  change: number;
  changeRate: number;
  volume: number;
}) {
  try {
    const { error } = await supabase
      .from('stock_prices')
      .upsert({
        code: stockData.code,
        price: stockData.price,
        change: stockData.change,
        changeRate: stockData.changeRate,
        volume: stockData.volume,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'code'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating stock price in DB:', error);
  }
}

// 백그라운드에서 주기적으로 가격 업데이트
export async function updateAllStockPrices() {
  try {
    const stocks = MAJOR_STOCKS;
    const updatedPrices = [];

    // 순차적으로 처리하여 API 호출 제한 준수
    for (const stock of stocks) {
      try {
        const data = await getKospiStocks(stock.code);
        if (data.output) {
          const price = {
            code: stock.code,
            price: parseInt(data.output.stck_prpr, 10),
            change: parseInt(data.output.prdy_vrss, 10),
            changeRate: parseFloat(data.output.prdy_ctrt),
            volume: parseInt(data.output.acml_vol, 10),
            updated_at: new Date().toISOString()
          };
          
          // DB에 가격 정보 업데이트
          const { error } = await supabase
            .from('stock_prices')
            .upsert([price], {
              onConflict: 'code'
            });

          if (error) throw error;
          updatedPrices.push(price);
          
          // API 호출 간격 조절 (0.5초)
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Error updating price for ${stock.code}:`, error);
      }
    }

    return updatedPrices;
  } catch (error) {
    console.error('Error updating all stock prices:', error);
    throw error;
  }
} 