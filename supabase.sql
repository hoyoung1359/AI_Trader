-- pgcrypto 확장 설치
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- 기존 함수들 삭제
drop function if exists register_user(text,text);
drop function if exists login_user(text,text);
drop function if exists get_valid_token(uuid);
drop function if exists logout_user(uuid);

-- 기존 테이블 삭제
drop table if exists access_tokens cascade;
drop table if exists stock_prices cascade;
drop table if exists stock_charts cascade;
drop table if exists technical_indicators cascade;
drop table if exists volume_analysis cascade;
drop table if exists users cascade;
drop table if exists password_reset_tokens cascade;

-- 사용자 테이블 생성
create table users (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  password text not null,
  name text,
  profile_image text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE
);

-- 접근 토큰 테이블 생성
create table access_tokens (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  token text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- 주식 가격 테이블 생성
create table stock_prices (
  code text primary key,
  price integer not null,
  change integer not null,
  "changeRate" decimal not null,
  volume bigint not null,
  updated_at timestamp with time zone default now()
);

-- 차트 데이터 테이블 생성
create table stock_charts (
  id uuid default uuid_generate_v4() primary key,
  stock_code text not null,
  period text not null,
  chart_data jsonb not null,
  updated_at timestamp with time zone default now(),
  constraint stock_code_period unique (stock_code, period)
);

-- 기술적 지표 테이블 생성
create table technical_indicators (
  id uuid default uuid_generate_v4() primary key,
  stock_code text not null,
  rsi decimal,
  macd text,
  bollinger text,
  updated_at timestamp with time zone default now(),
  constraint unique_stock_technical unique (stock_code)
);

-- 거래량 분석 테이블 생성
create table volume_analysis (
  id uuid default uuid_generate_v4() primary key,
  stock_code text not null,
  avg_volume bigint,
  strength text,
  institutional_net bigint,
  updated_at timestamp with time zone default now(),
  constraint unique_stock_volume unique (stock_code)
);

-- 비밀번호 재설정 토큰 테이블 생성
create table password_reset_tokens (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  token text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- 회원가입 함수 수정
create or replace function register_user(p_email text, raw_password text)
returns table (
    id uuid,
    email text,
    name text
)
language plpgsql
as $$
declare 
    new_user users%rowtype;
begin 
    -- 이메일 중복 확인
    if exists (select 1 from users u where u.email = p_email) then
        raise exception 'Email already exists';
    end if;

    -- 비밀번호 암호화 및 사용자 생성
    insert into users (email, password)
    values (p_email, crypt(raw_password, gen_salt('bf')))
    returning * into new_user;

    -- 결과 반환
    return query 
    select 
        u.id,
        u.email,
        u.name
    from users u
    where u.id = new_user.id;
end;
$$;

-- 로그인 함수 수정
create or replace function login_user(p_email text, raw_password text)
returns table (
    user_id uuid,
    user_email text,
    user_name text,
    token text
)
language plpgsql
as $$
declare 
    v_user RECORD;
    v_token TEXT;
begin 
    -- 사용자 확인 및 비밀번호 검증
    select id, email, name, password
    into v_user
    from users
    where email = p_email;
    
    if v_user.id is null then
        raise exception 'Invalid email or password';
    end if;
    
    if not crypt(raw_password, v_user.password) = v_user.password then
        raise exception 'Invalid email or password';
    end if;
    
    -- 새 토큰 생성
    v_token := encode(gen_random_bytes(32), 'hex');
    
    -- 토큰 업데이트
    update users
    set token = v_token,
        token_expires_at = now() + interval '24 hours'
    where id = v_user.id;
    
    -- 결과 반환
    return query 
    select 
        v_user.id,
        v_user.email,
        v_user.name,
        v_token;
end;
$$;

-- get_valid_token 함수 수정
create or replace function get_valid_token(p_user_id uuid)
returns table (
    access_token text,
    expires_at timestamp with time zone
)
language plpgsql
as $$
begin 
    return query 
    select 
        at.token as access_token,
        at.expires_at
    from access_tokens at 
    where at.user_id = p_user_id 
    and at.expires_at > now()
    order by at.created_at desc 
    limit 1;
end;
$$;

-- 로그아웃 함수 생성
create or replace function logout_user(p_user_id uuid)
returns void
language plpgsql
as $$
begin 
    delete from access_tokens where user_id = p_user_id;
end;
$$;

-- 인덱스 생성
create index idx_users_email on users(email);
create index idx_stock_prices_updated_at on stock_prices(updated_at);
create index idx_stock_charts_updated_at on stock_charts(updated_at);
create index idx_technical_indicators_updated_at on technical_indicators(updated_at);
create index idx_volume_analysis_updated_at on volume_analysis(updated_at);
