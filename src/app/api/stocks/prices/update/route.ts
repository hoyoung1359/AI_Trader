import { MAJOR_STOCKS, getKospiStocks, updateStockPriceInDB } from '@/lib/korea-investment/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 각 주요 종목의 가격 정보를 가져와서 DB에 저장
    for (const stock of MAJOR_STOCKS) {
      try {
        // API 호출 간 2초 딜레이 추가
        await new Promise(resolve => setTimeout(resolve, 2000));
        
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
      } catch (error) {
        console.error(`Error updating price for ${stock.code}:`, error);
        // 에러가 발생해도 계속 진행
        continue;
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating stock prices:', error);
    return NextResponse.json(
      { error: 'Failed to update stock prices' }, 
      { status: 500 }
    );
  }
} 