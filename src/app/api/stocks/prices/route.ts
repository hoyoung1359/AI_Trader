import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getStockPricesFromDB, updateAllStockPrices } from '@/lib/korea-investment/client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // DB에서 주식 가격 데이터 가져오기
    const prices = await getStockPricesFromDB();

    // 데이터가 없거나 오래된 경우 업데이트
    if (prices.length === 0 || isDataStale(prices[0].updated_at)) {
      console.log('Updating stock prices...');
      await updateAllStockPrices();
      const updatedPrices = await getStockPricesFromDB();
      return NextResponse.json(updatedPrices);
    }

    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    return NextResponse.json(
      { error: '주가 데이터를 가져오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// 데이터가 5분 이상 지났는지 확인
function isDataStale(updatedAt: string) {
  const lastUpdate = new Date(updatedAt).getTime();
  const now = new Date().getTime();
  const fiveMinutes = 5 * 60 * 1000;
  return now - lastUpdate > fiveMinutes;
} 