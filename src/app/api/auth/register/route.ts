import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // 1. 회원가입 처리
    const { data: registerData, error: registerError } = await supabase.rpc(
      'register_user',
      {
        p_email: email,
        raw_password: password,
      }
    );

    if (registerError) {
      console.error('회원가입 에러:', registerError);
      if (registerError.message.includes('Email already exists')) {
        return NextResponse.json(
          { error: '이미 등록된 이메일입니다' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: '회원가입에 실패했습니다' },
        { status: 400 }
      );
    }

    if (!registerData || registerData.length === 0) {
      return NextResponse.json(
        { error: '회원가입 처리 중 오류가 발생했습니다' },
        { status: 500 }
      );
    }

    const newUser = registerData[0];

    // 2. 이름 업데이트 (선택사항)
    if (name) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ name })
        .eq('id', newUser.user_id);

      if (updateError) {
        console.error('이름 업데이트 실패:', updateError);
      }
    }

    // 3. 자동 로그인
    const { data: loginData, error: loginError } = await supabase.rpc(
      'login_user',
      {
        p_email: email,
        raw_password: password,
      }
    );

    if (loginError || !loginData || loginData.length === 0) {
      console.error('자동 로그인 실패:', loginError);
      return NextResponse.json({ 
        message: '회원가입은 완료되었으나, 자동 로그인에 실패했습니다. 로그인 페이지에서 다시 시도해주세요.' 
      });
    }

    const userData = loginData[0];

    // 4. 응답 생성
    const response = NextResponse.json({
      user: {
        id: userData.user_id,
        email: userData.user_email,
        name: userData.user_name
      },
      token: userData.token,
      message: '회원가입이 완료되었습니다'
    });

    // 5. 쿠키에 토큰 저장
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
    console.error('회원가입 처리 중 에러:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
} 