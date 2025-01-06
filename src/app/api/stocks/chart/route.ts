import { getStockChart } from '@/lib/korea-investment/client';
import { NextResponse } from 'next/server';

type ChartPeriod = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y'; // 예시 타입 선언

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code') || '';
  const period = (searchParams.get('period')?.toUpperCase() || '1M') as ChartPeriod;

  if (!code) {
    return NextResponse.json(
      { error: 'Stock code is required' },
      { status: 400 }
    );
  }

  try {
    const chartData = await getStockChart(code, period as ChartPeriod);
    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error in chart API route:', error);
    return NextResponse.json(
      { error: 'Chart data error' },
      { status: 500 }
    );
  }
}