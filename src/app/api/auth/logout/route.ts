import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { message: '이미 로그아웃되었습니다' },
        { status: 200 }
      );
    }

    // 토큰으로 사용자 ID 조회
    const { data: tokenData, error: tokenError } = await supabase
      .from('access_tokens')
      .select('user_id')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      console.error('토큰 조회 실패:', tokenError);
    } else {
      // 로그아웃 함수 호출
      await supabase.rpc('logout_user', {
        p_user_id: tokenData.user_id
      });
    }

    // 쿠키 삭제
    const response = NextResponse.json({ message: '로그아웃되었습니다' });
    response.cookies.delete('auth_token');

    return response;
  } catch (error) {
    console.error('로그아웃 처리 중 에러:', error);
    return NextResponse.json(
      { error: '로그아웃 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
} 