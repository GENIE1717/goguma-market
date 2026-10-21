-- 고구마마켓 5단계: 프로필 꾸미기, 좋아요, 신고, 고구마 온도, 동네 인증, 채팅, 다시 굽기

-- ─── 프로필 ───────────────────────────────────────────────
-- GPS 좌표 자체는 저장하지 않는다. 찾은 동네와 인증 시각, 판매 범위만 저장.
alter table public.goguma_profiles
  add column avatar_path text,
  add column bio text not null default '' check (char_length(bio) <= 300),
  add column location_verified_at timestamptz,
  add column sell_range_km smallint not null default 0 check (sell_range_km in (0, 2, 5, 10));

-- ─── 판매글: 다시 굽기(끌어올리기) ─────────────────────────
alter table public.goguma_products
  add column bumped_at timestamptz not null default now();
update public.goguma_products set bumped_at = created_at;
create index goguma_products_bumped_at_idx on public.goguma_products (bumped_at desc);

-- ─── 좋아요 ────────────────────────────────────────────────
create table public.goguma_likes (
  user_id    uuid not null default auth.uid() references public.goguma_profiles (id) on delete cascade,
  product_id bigint not null references public.goguma_products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);
create index goguma_likes_product_id_idx on public.goguma_likes (product_id);

alter table public.goguma_likes enable row level security;

create policy "goguma_likes: 누구나 조회"
  on public.goguma_likes for select to anon, authenticated using (true);

-- 내 이름으로만, 그리고 내 글에는 좋아요 금지 (온도 셀프 올리기 방지)
create policy "goguma_likes: 본인만 누르기"
  on public.goguma_likes for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and not exists (
      select 1 from public.goguma_products p where p.id = product_id and p.seller_id = (select auth.uid())
    )
  );

create policy "goguma_likes: 본인만 취소"
  on public.goguma_likes for delete to authenticated using ((select auth.uid()) = user_id);

-- ─── 비매너 신고 ───────────────────────────────────────────
create table public.goguma_reports (
  id          bigint generated always as identity primary key,
  reporter_id uuid not null default auth.uid() references public.goguma_profiles (id) on delete cascade,
  reported_id uuid not null references public.goguma_profiles (id) on delete cascade,
  product_id  bigint references public.goguma_products (id) on delete set null,
  reason      text not null check (reason in ('사기 의심', '욕설·비매너', '약속 불이행', '허위 매물', '기타')),
  detail      text not null check (char_length(detail) between 10 and 1000),
  evidence    text[] not null default '{}' check (cardinality(evidence) <= 5),
  created_at  timestamptz not null default now(),
  check (reporter_id <> reported_id)
);
create index goguma_reports_reported_id_idx on public.goguma_reports (reported_id);
create index goguma_reports_reporter_id_idx on public.goguma_reports (reporter_id);

alter table public.goguma_reports enable row level security;

-- 신고 내용은 신고한 본인만 볼 수 있다 (신고당한 사람·다른 사람은 못 봄)
create policy "goguma_reports: 본인 신고만 조회"
  on public.goguma_reports for select to authenticated using ((select auth.uid()) = reporter_id);

create policy "goguma_reports: 본인 이름으로만 신고"
  on public.goguma_reports for insert to authenticated with check ((select auth.uid()) = reporter_id);

-- ─── 고구마 온도 ───────────────────────────────────────────
-- 기본 36.5도. 내 글이 받은 좋아요 1개당 +0.1도, 나를 신고한 사람 1명당 -1.0도. 0 ~ 99.9도.
-- 신고 목록은 비공개라서 security definer 로 "숫자만" 계산해 준다.
create function public.goguma_temperature(target uuid)
returns numeric
language sql
stable
security definer
set search_path = ''
as $$
  select greatest(0, least(99.9, round(
    36.5
    + 0.1 * (
      select count(*) from public.goguma_likes l
      join public.goguma_products p on p.id = l.product_id
      where p.seller_id = target
    )
    - 1.0 * (
      select count(distinct r.reporter_id) from public.goguma_reports r where r.reported_id = target
    ), 1)));
$$;

revoke execute on function public.goguma_temperature(uuid) from public;
grant execute on function public.goguma_temperature(uuid) to anon, authenticated;

-- ─── 채팅 ──────────────────────────────────────────────────
-- 판매글 하나에 구매자 한 명당 채팅방 하나
create table public.goguma_chat_rooms (
  id                   bigint generated always as identity primary key,
  product_id           bigint not null references public.goguma_products (id) on delete cascade,
  seller_id            uuid not null references public.goguma_profiles (id) on delete cascade,
  buyer_id             uuid not null default auth.uid() references public.goguma_profiles (id) on delete cascade,
  created_at           timestamptz not null default now(),
  last_message_at      timestamptz not null default now(),
  seller_last_read_at  timestamptz not null default now(),
  buyer_last_read_at   timestamptz not null default now(),
  unique (product_id, buyer_id),
  check (seller_id <> buyer_id)
);
create index goguma_chat_rooms_seller_id_idx on public.goguma_chat_rooms (seller_id);
create index goguma_chat_rooms_buyer_id_idx on public.goguma_chat_rooms (buyer_id);

alter table public.goguma_chat_rooms enable row level security;

create policy "goguma_chat_rooms: 참여자만 조회"
  on public.goguma_chat_rooms for select to authenticated
  using ((select auth.uid()) in (seller_id, buyer_id));

-- 구매자가 방을 연다. 판매자는 그 글의 진짜 판매자여야 한다.
create policy "goguma_chat_rooms: 구매자가 열기"
  on public.goguma_chat_rooms for insert to authenticated
  with check (
    (select auth.uid()) = buyer_id
    and seller_id = (select p.seller_id from public.goguma_products p where p.id = product_id)
  );

create table public.goguma_chat_messages (
  id         bigint generated always as identity primary key,
  room_id    bigint not null references public.goguma_chat_rooms (id) on delete cascade,
  sender_id  uuid not null default auth.uid() references public.goguma_profiles (id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index goguma_chat_messages_room_id_idx on public.goguma_chat_messages (room_id, created_at);
create index goguma_chat_messages_sender_id_idx on public.goguma_chat_messages (sender_id);

alter table public.goguma_chat_messages enable row level security;

create policy "goguma_chat_messages: 참여자만 조회"
  on public.goguma_chat_messages for select to authenticated
  using (exists (
    select 1 from public.goguma_chat_rooms r
    where r.id = room_id and (select auth.uid()) in (r.seller_id, r.buyer_id)
  ));

create policy "goguma_chat_messages: 참여자만 보내기"
  on public.goguma_chat_messages for insert to authenticated
  with check (
    (select auth.uid()) = sender_id
    and exists (
      select 1 from public.goguma_chat_rooms r
      where r.id = room_id and (select auth.uid()) in (r.seller_id, r.buyer_id)
    )
  );

-- 메시지가 오면 방의 마지막 메시지 시각을 갱신 (방 목록 정렬용)
create function public.goguma_touch_chat_room()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.goguma_chat_rooms set last_message_at = new.created_at where id = new.room_id;
  return new;
end;
$$;
revoke execute on function public.goguma_touch_chat_room() from public, anon, authenticated;

create trigger goguma_on_chat_message
  after insert on public.goguma_chat_messages
  for each row execute function public.goguma_touch_chat_room();

-- 방에 들어오면 "여기까지 읽음" 표시. 내 쪽 읽음 시각만 바꿀 수 있다.
create function public.goguma_mark_chat_read(target_room bigint)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.goguma_chat_rooms
  set seller_last_read_at = case when seller_id = (select auth.uid()) then now() else seller_last_read_at end,
      buyer_last_read_at  = case when buyer_id  = (select auth.uid()) then now() else buyer_last_read_at end
  where id = target_room and (select auth.uid()) in (seller_id, buyer_id);
$$;
revoke execute on function public.goguma_mark_chat_read(bigint) from public, anon;
grant execute on function public.goguma_mark_chat_read(bigint) to authenticated;

-- 실시간으로 새 메시지를 받기 위해 Realtime 에 등록
alter publication supabase_realtime add table public.goguma_chat_messages;

-- ─── 사진 버킷 ─────────────────────────────────────────────
-- 프로필 사진: 누구나 볼 수 있음
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('goguma-avatars', 'goguma-avatars', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- 신고 증거 사진: 비공개 (신고한 본인만)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('goguma-report-evidence', 'goguma-report-evidence', false, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

create policy "goguma-avatars: 내 폴더에만 올리기"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'goguma-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "goguma-avatars: 내 사진 조회"
  on storage.objects for select to authenticated
  using (bucket_id = 'goguma-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "goguma-avatars: 내 사진만 지우기"
  on storage.objects for delete to authenticated
  using (bucket_id = 'goguma-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "goguma-report-evidence: 내 폴더에만 올리기"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'goguma-report-evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "goguma-report-evidence: 내 증거만 조회"
  on storage.objects for select to authenticated
  using (bucket_id = 'goguma-report-evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "goguma-report-evidence: 내 증거만 지우기"
  on storage.objects for delete to authenticated
  using (bucket_id = 'goguma-report-evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);
