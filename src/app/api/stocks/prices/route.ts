import { getStockPricesFromDB } from '@/lib/korea-investment/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const prices = await getStockPricesFromDB();
    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock prices' }, 
      { status: 500 }
    );
  }
} 