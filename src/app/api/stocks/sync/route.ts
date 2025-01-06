import { supabase } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';
import { getKospiStockList } from '@/lib/korea-investment/client';

export async function POST() {
  try {
    // 전체 코스피 종목 데이터 가져오기
    const kospiStocks = await getKospiStockList();
    console.log('Fetched stocks:', kospiStocks);

    if (!kospiStocks?.length) {
      throw new Error('No stocks data received');
    }

    // 기존 데이터 삭제
    const { error: deleteError } = await supabase
      .from('stocks')
      .delete()
      .neq('id', 0);

    if (deleteError) {
      console.error('Error deleting existing stocks:', deleteError);
      throw deleteError;
    }

    // 새 데이터 입력
    const { error: insertError } = await supabase
      .from('stocks')
      .insert(
        kospiStocks.map(stock => ({
          code: stock.mksc_shrn_iscd,
          name: stock.hts_kor_isnm,
          sector: stock.bstp_kor_isnm,
          market: 'KOSPI'
        }))
      );

    if (insertError) {
      console.error('Error inserting stocks:', insertError);
      throw insertError;
    }

    return NextResponse.json({ 
      message: 'Stocks synced successfully',
      count: kospiStocks.length
    });
  } catch (error) {
    console.error('Error syncing stocks:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync stocks' },
      { status: 500 }
    );
  }
} 