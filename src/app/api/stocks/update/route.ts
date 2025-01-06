import { updateAllStockPrices } from '@/lib/korea-investment/client';
import { NextResponse } from 'next/server';

// 5분마다 실행되는 API 엔드포인트
export async function GET() {
  try {
    await updateAllStockPrices();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating stock prices:', error);
    return NextResponse.json({ error: 'Failed to update stock prices' }, { status: 500 });
  }
} 