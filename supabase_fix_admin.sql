-- 1. Ensure profiles table exists
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  email text,
  role text default 'USER' check (role in ('USER', 'ADMIN'))
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create policies (if they don't exist, this might error, but it's safe to ignore if policies exist)
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- 4. Create a trigger to automatically create a profile entry when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email, 'USER');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. ★★★ IMPORTANT: Grant ADMIN role to your specific email ★★★
-- 5. ★★★ IMPORTANT: Grant ADMIN role to your specific email ★★★
-- Replace 'admin@example.com' with your actual email address
-- This query acts as an UPSERT: it creates the profile if it doesn't exist, or updates it if it does.
INSERT INTO public.profiles (id, email, role, full_name, avatar_url)
SELECT 
  id, 
  email, 
  'ADMIN', 
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE email = 'admin@example.com' -- <<< REPLACE THIS with your email
ON CONFLICT (id) DO UPDATE
SET role = 'ADMIN';
