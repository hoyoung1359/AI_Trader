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

    // access_tokens 테이블에서 토큰 확인
    const { data: tokenData, error: tokenError } = await supabase
      .from('access_tokens')
      .select('user_id')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      // 토큰이 유효하지 않으면 401 반환
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // 유효한 토큰이면 사용자 정보 조회
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('id', tokenData.user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in me route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 