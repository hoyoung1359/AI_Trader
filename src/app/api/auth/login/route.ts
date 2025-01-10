import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. 로그인 시도
    const { data: loginData, error: loginError } = await supabase.rpc(
      'login_user',
      {
        p_email: email,
        raw_password: password,
      }
    );

    if (loginError) {
      console.error('로그인 에러:', loginError);
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 잘못되었습니다' },
        { status: 401 }
      );
    }

    if (!loginData || loginData.length === 0) {
      return NextResponse.json(
        { error: '로그인 처리 중 오류가 발생했습니다' },
        { status: 500 }
      );
    }

    const userData = loginData[0];

    // 2. 응답 생성
    const response = NextResponse.json({
      user: {
        id: userData.user_id,
        email: userData.user_email,
        name: userData.user_name
      },
      token: userData.token
    });

    // 3. 쿠키에 토큰 저장
    response.cookies.set({
      name: 'auth_token',
      value: userData.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24시간
    });

    return response;
  } catch (error) {
    console.error('로그인 처리 중 에러:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
} 