import { getKospiStocks } from '@/lib/korea-investment/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code') || '005930';

  try {
    const stockResponse = await getKospiStocks(code);
    return NextResponse.json(stockResponse);
  } catch (error) {
    console.error('Error in stocks API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stocks' },
      { status: 500 }
    );
  }
} 