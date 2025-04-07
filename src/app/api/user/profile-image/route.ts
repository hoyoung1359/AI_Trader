import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // 1. 사용자 인증 확인
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // 2. 토큰으로 사용자 정보 조회
    const { data: userData, error: userError } = await supabase.rpc(
      'get_valid_token',
      { p_token: token }
    );

    if (userError || !userData || userData.length === 0) {
      return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }

    const userId = userData[0].user_id;

    // 3. 파일 처리
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: '이미지 파일이 필요합니다.' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기는 5MB를 초과할 수 없습니다.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다.' }, { status: 400 });
    }

    // 4. 파일 변환 및 업로드
    const buffer = await file.arrayBuffer();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    // 5. 기존 이미지 삭제
    const { data: oldUserData } = await supabase
      .from('users')
      .select('profile_image')
      .eq('id', userId)
      .single();

    if (oldUserData?.profile_image) {
      const oldFilePath = oldUserData.profile_image.split('/').pop();
      if (oldFilePath) {
        await supabase.storage
          .from('profile-storage')
          .remove([`profile-images/${oldFilePath}`]);
      }
    }

    // 6. 새 이미지 업로드
    const { error: uploadError } = await supabase.storage
      .from('profile-storage')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      console.error('이미지 업로드 에러:', uploadError);
      return NextResponse.json({ error: '이미지 업로드에 실패했습니다.', details: uploadError }, { status: 500 });
    }

    // 7. 이미지 URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from('profile-storage')
      .getPublicUrl(filePath);

    // 8. 사용자 프로필 업데이트
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_image: publicUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('프로필 업데이트 에러:', updateError);
      return NextResponse.json({ error: '프로필 업데이트에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('서버 에러:', error);
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
} 