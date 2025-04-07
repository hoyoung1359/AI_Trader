import { NextResponse } from 'next/server';
import { getStockChart } from '@/lib/korea-investment/client';
import { ChartPeriod } from '@/types/chart';

interface ChartDataItem {
  stck_bsop_date: string;  // 거래일자
  stck_clpr: string;       // 종가
  stck_oprc: string;       // 시가
  stck_hgpr: string;       // 고가
  stck_lwpr: string;       // 저가
  acml_vol: string;        // 거래량
}

interface ChartResponse {
  output2: ChartDataItem[];
  rt_cd: string;
  msg_cd: string;
  msg1: string;
}

type TimeUnit = 'minute' | 'day' | 'week' | 'month';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const period = searchParams.get('period');
    const unit = searchParams.get('unit') as TimeUnit || 'day';

    if (!code || !period) {
      return NextResponse.json(
        { error: '올바른 종목 코드와 기간이 필요합니다.' },
        { status: 400 }
      );
    }

    // 한국투자증권 API에 맞는 파라미터로 변환
    const params = convertToApiParams(period, unit);
    
    const response = await getStockChart({ 
      code,
      ...params
    }) as ChartResponse;
    
    if (!response.output2 || !Array.isArray(response.output2)) {
      console.error('Invalid chart data format:', response);
      throw new Error('차트 데이터 형식이 올바르지 않습니다.');
    }

    // API 응답 데이터를 프론트엔드 형식으로 변환
    const chartData = response.output2.map((item: ChartDataItem) => ({
      date: formatDate(item.stck_bsop_date, unit),
      시가: Number(item.stck_oprc),
      고가: Number(item.stck_hgpr),
      저가: Number(item.stck_lwpr),
      종가: Number(item.stck_clpr),
      거래량: Number(item.acml_vol)
    }));

    // 날짜 오름차순으로 정렬
    chartData.sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error in chart API route:', error);
    return NextResponse.json(
      { error: '차트 데이터를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

function convertToApiParams(period: string, unit: TimeUnit) {
  // 분봉 데이터
  if (unit === 'minute') {
    const minuteMap: Record<string, { unit: string; count: number }> = {
      '1m': { unit: '1', count: 60 },
      '5m': { unit: '5', count: 60 },
      '15m': { unit: '15', count: 60 },
      '30m': { unit: '30', count: 60 },
      '1h': { unit: '60', count: 60 }
    };
    
    const params = minuteMap[period];
    if (params) {
      return {
        period: 'D',
        unit: params.unit,
        count: params.count,
        inqStrtDd: getTodayString(),
        inqEndDd: getTodayString(),
        trId: 'FHKST03010200'  // 분봉
      };
    }
  }

  // 일/주/월봉 데이터
  const periodMap: Record<string, { period: string; count: number; trId: string }> = {
    '1D': { period: 'D', count: 1, trId: 'FHKST01010100' },   // 일봉
    '1W': { period: 'W', count: 1, trId: 'FHKST01010200' },   // 주봉
    '1M': { period: 'M', count: 1, trId: 'FHKST01010300' },   // 월봉
    '3M': { period: 'M', count: 3, trId: 'FHKST01010300' },
    '6M': { period: 'M', count: 6, trId: 'FHKST01010300' },
    '1Y': { period: 'Y', count: 1, trId: 'FHKST01010300' }
  };

  const params = periodMap[period];
  if (params) {
    return {
      period: params.period,
      count: params.count,
      trId: params.trId
    };
  }

  // 기본값: 일봉 1개월
  return {
    period: 'D',
    count: 30,
    trId: 'FHKST01010100'
  };
}

function formatDate(date: string, unit: TimeUnit): string {
  if (unit === 'minute') {
    // 분봉 데이터의 경우 시:분 형식으로 변환
    return `${date.slice(8, 10)}:${date.slice(10, 12)}`;
  }
  // 일/주/월봉 데이터의 경우 YYYY-MM-DD 형식으로 변환
  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
}

function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}