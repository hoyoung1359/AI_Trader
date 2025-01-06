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
      .rpc('get_valid_token');

    if (error) throw error;
    if (data && data.length > 0) {
      return data[0].token;
    }
    return null;
  } catch (error) {
    console.error('Error getting token from DB:', error);
    return null;
  }
}

async function saveTokenToDB(token: string, expiresIn: number) {
  try {
    const expiresAt = new Date(Date.now() + (expiresIn * 1000));
    
    const { error } = await supabase
      .from('access_tokens')
      .insert([
        {
          token,
          expires_at: expiresAt.toISOString()
        }
      ]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving token to DB:', error);
  }
}

export async function getAccessToken(): Promise<string> {
  try {
    // DB에서 유효한 토큰 확인
    const cachedToken = await getValidTokenFromDB();
    if (cachedToken) {
      return cachedToken;
    }

    // 토큰 발급 요청 전 1초 대기
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 새 토큰 발급
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
    
    if (!response.ok || data.error_code) {
      if (data.error_code === 'EGW00133') {
        // 1분 대기 후 재시도
        await new Promise(resolve => setTimeout(resolve, 60 * 1000));
        return getAccessToken(); // 재귀적 재시도
      }
      throw new Error(data.error_description || 'Failed to get access token');
    }

    // 새 토큰을 DB에 저장
    try {
      await saveTokenToDB(data.access_token, data.expires_in);
    } catch (error) {
      console.error('Error saving token to DB:', error);
      // DB 저장 실패해도 토큰은 반환
    }
    
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

export async function getKospiStocks(stockCode: string): Promise<StockResponse> {
  try {
    const token = await getAccessToken();
    
    const url = new URL(`${BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-price`);
    url.searchParams.append('FID_COND_MRKT_DIV_CODE', 'J');
    url.searchParams.append('FID_INPUT_ISCD', stockCode);
    
    const response = await fetch(url, {
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

interface ChartData {
  stck_bsop_date: string;  // 거래일자
  stck_clpr: string;       // 종가
  stck_oprc: string;       // 시가
  stck_hgpr: string;       // 고가
  stck_lwpr: string;       // 저가
  acml_vol: string;        // 거래량
}

async function getChartFromDB(stockCode: string, period: ChartPeriod): Promise<ChartData[] | null> {
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

async function saveChartToDB(stockCode: string, period: ChartPeriod, chartData: ChartData[]) {
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

export async function getStockChart(
  stockCode: string, 
  period: ChartPeriod = '1M'
): Promise<ChartData[]> {
  try {
    const token = await getAccessToken();
    const params = getPeriodParams(period, stockCode);
    
    const url = new URL(`${BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-daily-price`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const response = await fetch(url.toString(), {
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`,
        'appkey': process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_KEY!,
        'appsecret': process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_SECRET!,
        'tr_id': 'FHKST01010400',
        'custtype': 'P',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.output || !Array.isArray(data.output)) {
      throw new Error('Invalid API response format');
    }

    return data.output.map((item: any) => ({
      date: item.stck_bsop_date,
      시가: parseFloat(item.stck_oprc),
      고가: parseFloat(item.stck_hgpr),
      저가: parseFloat(item.stck_lwpr),
      종가: parseFloat(item.stck_clpr),
      거래량: parseInt(item.acml_vol),
    }));

  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
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
  for (const stock of MAJOR_STOCKS) {
    try {
      const data = await getKospiStocks(stock.code);
      if (data?.output) {
        await updateStockPriceInDB({
          code: stock.code,
          price: parseInt(data.output.stck_prpr) || 0,
          change: parseInt(data.output.prdy_vrss) || 0,
          changeRate: parseFloat(data.output.prdy_ctrt) || 0,
          volume: parseInt(data.output.acml_vol) || 0,
        });
      }
      // API 호출 간 딜레이
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error updating price for ${stock.code}:`, error);
    }
  }
} 