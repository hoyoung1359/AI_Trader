import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PUT(request: NextRequest) {
  try {
    const { name } = await request.json();
    const userId = request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { error } = await supabase
      .from('users')
      .update({ name })
      .eq('id', userId);

    if (error) {
      console.error('프로필 업데이트 에러:', error);
      return NextResponse.json({ error: '프로필 업데이트에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ message: '프로필이 업데이트되었습니다.' });
  } catch (error) {
    console.error('서버 에러:', error);
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
} 