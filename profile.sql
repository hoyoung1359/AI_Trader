-- 1. 기존 정책 삭제 (충돌 방지)
drop policy if exists "프로필 이미지 업로드 정책" on storage.objects;
drop policy if exists "프로필 이미지 조회 정책" on storage.objects;
drop policy if exists "프로필 이미지 삭제 정책" on storage.objects;

-- 프로필 이미지 업로드 정책
create policy "프로필 이미지 업로드 정책"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'profile-storage' and
  (storage.foldername(name))[1] = 'profile-images'
);

-- 프로필 이미지 조회 정책
create policy "프로필 이미지 조회 정책"
on storage.objects for select
to public
using (
  bucket_id = 'profile-storage' and
  (storage.foldername(name))[1] = 'profile-images'
);

-- 프로필 이미지 삭제 정책
create policy "프로필 이미지 삭제 정책"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'profile-storage' and
  (storage.foldername(name))[1] = 'profile-images' and
  (storage.filename(name))::text like (auth.uid() || '-%')
);

-- 5. users 테이블의 profile_image 컬럼 인덱스 추가 (이미 있다면 무시)
create index if not exists idx_users_profile_image
on users (profile_image);

-- 6. 프로필 이미지 URL 업데이트 함수
create or replace function update_profile_image(
  p_user_id uuid,
  p_image_url text
)
returns void
language plpgsql
security definer
as $$
begin
  update users
  set 
    profile_image = p_image_url,
    updated_at = now()
  where id = p_user_id;
end;
$$;