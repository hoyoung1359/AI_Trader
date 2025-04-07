import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // 토큰 유효성 검사
    const { data: tokenData, error: tokenError } = await supabase.rpc(
      'get_valid_token',
      { p_token: token }
    );

    if (tokenError || !tokenData || tokenData.length === 0) {
      // 토큰이 만료되었거나 유효하지 않은 경우 쿠키 삭제
      const response = NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
      response.cookies.delete('auth_token');
      return response;
    }

    const userData = tokenData[0];
    const expiresAt = new Date(userData.expires_at);
    const now = new Date();
    const daysLeft = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    // 토큰 만료까지 7일 이내로 남은 경우 토큰 갱신
    if (daysLeft < 7) {
      const { data: refreshData, error: refreshError } = await supabase.rpc(
        'login_user',
        {
          p_email: userData.email,
          raw_password: '' // 비밀번호 없이 토큰만 갱신
        }
      );

      if (!refreshError && refreshData && refreshData.length > 0) {
        const response = NextResponse.json({
          id: userData.user_id,
          email: userData.email,
          name: userData.name
        });

        // 새로운 토큰으로 쿠키 업데이트
        response.cookies.set({
          name: 'auth_token',
          value: refreshData[0].auth_token,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60 // 30일
        });

        return response;
      }
    }

    // 토큰이 유효하고 갱신이 필요없는 경우
    return NextResponse.json({
      id: userData.user_id,
      email: userData.email,
      name: userData.name
    });

  } catch (error) {
    console.error('Error in me route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 