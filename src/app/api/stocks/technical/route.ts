import { NextResponse } from 'next/server';
import { MAJOR_STOCKS } from '@/lib/korea-investment/client';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      throw new Error('Stock code is required');
    }

    // Supabase에서 기술적 지표 데이터 조회
    const { data, error } = await supabase
      .from('technical_indicators')
      .select('*')
      .eq('stock_code', code)
      .maybeSingle();

    // 데이터가 없거나 에러가 발생한 경우 새로운 데이터 생성
    if (!data || error) {
      const mockData = {
        stock_code: code,
        rsi: Number((40 + Math.random() * 30).toFixed(2)),
        macd: Math.random() > 0.5 ? '상승' : '하락',
        bollinger: ['상단', '중간', '하단'][Math.floor(Math.random() * 3)]
      };

      // upsert를 사용하여 데이터 삽입 또는 업데이트
      const { error: upsertError } = await supabase
        .from('technical_indicators')
        .upsert(mockData, {
          onConflict: 'stock_code'
        });

      if (upsertError) {
        console.error('Error upserting data:', upsertError);
      }
      
      return NextResponse.json(mockData);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching technical indicators:', error);
    return NextResponse.json(
      { error: 'Failed to fetch technical indicators' },
      { status: 500 }
    );
  }
} 