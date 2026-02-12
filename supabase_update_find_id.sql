-- 1. profiles 테이블에 email 컬럼 추가
alter table public.profiles add column if not exists email text;

-- 2. 기존 사용자들의 email 데이터를 auth.users에서 가져와서 채우기
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id;

-- 3. 회원가입 시 email도 함께 저장하도록 트리거 함수 수정
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email, 'USER');
  return new;
end;
$$ language plpgsql security definer;
