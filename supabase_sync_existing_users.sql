-- 기존에 이미 가입된 유저들을 profiles 테이블로 복사하는 스크립트입니다.
-- Supabase SQL Editor에서 실행해 주세요.

insert into public.profiles (id, full_name, role)
select 
  id, 
  raw_user_meta_data->>'full_name', 
  'USER' -- 우선 기본 USER 권한으로 생성됩니다.
from auth.users
on conflict (id) do nothing;

-- 실행 후, Table Editor에서 본인 계정의 role을 'ADMIN'으로 수정하시면 됩니다.
-- 2. 특정 사용자를 관리자(ADMIN)로 격상시키려면 아래 SQL을 실행하세요.
-- 'ankijung88@gmail.com' 부분에 본인의 이메일을 넣으세요.
update public.profiles
set role = 'ADMIN'
from auth.users
where public.profiles.id = auth.users.id
and auth.users.email = 'ankijung88@gmail.com';
