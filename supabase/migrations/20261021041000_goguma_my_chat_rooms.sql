-- 내 채팅방 목록 (상대방, 판매글, 마지막 메시지, 안 읽은 개수)
-- security invoker: RLS 가 그대로 적용되어 내가 참여한 방만 나온다
create function public.goguma_my_chat_rooms()
returns table (
  id bigint,
  product_id bigint,
  product_title text,
  product_image text,
  other_id uuid,
  other_nickname text,
  other_avatar text,
  last_message text,
  last_message_at timestamptz,
  unread bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    r.id,
    r.product_id,
    p.title,
    p.images[1],
    o.id,
    o.nickname,
    o.avatar_path,
    (select m.body from public.goguma_chat_messages m where m.room_id = r.id order by m.created_at desc limit 1),
    r.last_message_at,
    (select count(*) from public.goguma_chat_messages m
      where m.room_id = r.id
        and m.sender_id <> (select auth.uid())
        and m.created_at > case when r.seller_id = (select auth.uid()) then r.seller_last_read_at else r.buyer_last_read_at end)
  from public.goguma_chat_rooms r
  join public.goguma_products p on p.id = r.product_id
  join public.goguma_profiles o on o.id = case when r.seller_id = (select auth.uid()) then r.buyer_id else r.seller_id end
  where (select auth.uid()) in (r.seller_id, r.buyer_id)
  order by r.last_message_at desc;
$$;

revoke execute on function public.goguma_my_chat_rooms() from public, anon;
grant execute on function public.goguma_my_chat_rooms() to authenticated;
