-- 고구마마켓 2단계: 판매글 (사진은 다음 단계에서)

create table public.goguma_products (
  id          bigint generated always as identity primary key,
  seller_id   uuid not null default auth.uid() references public.goguma_profiles (id) on delete cascade,
  title       text not null check (char_length(title) between 2 and 40),
  category    text not null check (category in ('고구마·농산물', '디지털기기', '가구·인테리어', '생활·주방', '의류·잡화', '도서·취미', '기타')),
  price       integer not null check (price between 0 and 100000000),
  description text not null check (char_length(description) between 10 and 2000),
  created_at  timestamptz not null default now()
);

create index goguma_products_seller_id_idx on public.goguma_products (seller_id);
create index goguma_products_created_at_idx on public.goguma_products (created_at desc);

alter table public.goguma_products enable row level security;

-- 판매글은 누구나 볼 수 있다
create policy "goguma_products: 누구나 조회"
  on public.goguma_products for select
  to anon, authenticated
  using (true);

-- 글쓰기는 로그인한 본인 이름으로만
create policy "goguma_products: 본인만 작성"
  on public.goguma_products for insert
  to authenticated
  with check ((select auth.uid()) = seller_id);

-- 수정·삭제도 본인만
create policy "goguma_products: 본인만 수정"
  on public.goguma_products for update
  to authenticated
  using ((select auth.uid()) = seller_id)
  with check ((select auth.uid()) = seller_id);

create policy "goguma_products: 본인만 삭제"
  on public.goguma_products for delete
  to authenticated
  using ((select auth.uid()) = seller_id);
