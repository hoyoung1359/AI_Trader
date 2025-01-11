import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: '이미 로그아웃되었습니다' },
        { status: 200 }
      );
    }

    // DB에서 토큰 삭제
    const { error: deleteError } = await supabase
      .from('access_tokens')
      .delete()
      .eq('token', token);

    if (deleteError) {
      console.error('토큰 삭제 실패:', deleteError);
      return NextResponse.json(
        { error: '로그아웃 처리 중 오류가 발생했습니다' },
        { status: 500 }
      );
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