import { NextResponse } from 'next/server';
import { getStockChart } from '@/lib/korea-investment/client';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const period = searchParams.get('period');

    if (!code || !period) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const response = await getStockChart(code, period) as ChartResponse;
    
    // API 응답 데이터를 프론트엔드 형식으로 변환
    const chartData = response.output2.map((item: ChartDataItem) => ({
      date: item.stck_bsop_date,
      시가: Number(item.stck_oprc),
      고가: Number(item.stck_hgpr),
      저가: Number(item.stck_lwpr),
      종가: Number(item.stck_clpr),
      거래량: Number(item.acml_vol)
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error in chart API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}