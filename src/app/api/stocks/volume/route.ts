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

    // Supabase에서 거래량 분석 데이터 조회
    const { data, error } = await supabase
      .from('volume_analysis')
      .select('*')
      .eq('stock_code', code)
      .maybeSingle();

    // 데이터가 없거나 에러가 발생한 경우 새로운 데이터 생성
    if (!data || error) {
      const mockData = {
        stock_code: code,
        avg_volume: Math.floor(Math.random() * 1000000) + 500000,
        strength: Math.random() > 0.5 ? '강세' : '약세',
        institutional_net: Math.floor((Math.random() - 0.5) * 100000)
      };

      // upsert를 사용하여 데이터 삽입 또는 업데이트
      const { error: upsertError } = await supabase
        .from('volume_analysis')
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
    console.error('Error fetching volume analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volume analysis' },
      { status: 500 }
    );
  }
} 