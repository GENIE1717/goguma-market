-- 고구마마켓 1단계: 회원 프로필
-- 가계부와 같은 DB를 쓰므로 테이블/함수 이름에 goguma_ 접두사를 붙여 구분한다.

create table public.goguma_profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  nickname     text not null check (char_length(nickname) between 2 and 12),
  neighborhood text not null default '고구마동' check (char_length(neighborhood) between 1 and 20),
  created_at   timestamptz not null default now()
);

alter table public.goguma_profiles enable row level security;

-- 닉네임/동네는 다른 사람도 볼 수 있다 (판매자 정보 표시용)
create policy "goguma_profiles: 누구나 조회"
  on public.goguma_profiles for select
  to anon, authenticated
  using (true);

-- 수정은 본인만
create policy "goguma_profiles: 본인만 수정"
  on public.goguma_profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- 회원가입 시 auth.users 에 행이 생기면 프로필을 자동으로 만든다.
-- signUp({ options: { data: { nickname, neighborhood } } }) 로 넘긴 값이 raw_user_meta_data 에 들어온다.
create function public.goguma_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.goguma_profiles (id, nickname, neighborhood)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'nickname', ''), '익명고구마' || substr(new.id::text, 1, 4)),
    coalesce(nullif(new.raw_user_meta_data ->> 'neighborhood', ''), '고구마동')
  );
  return new;
end;
$$;

revoke execute on function public.goguma_handle_new_user() from public, anon, authenticated;

create trigger goguma_on_auth_user_created
  after insert on auth.users
  for each row execute function public.goguma_handle_new_user();
