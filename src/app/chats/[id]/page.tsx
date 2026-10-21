import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { ChatRoom } from "./chat-room";
import { Avatar } from "@/components/avatar";
import { MannerTemperatureBadge } from "@/components/manner-temperature";
import { getCurrentProfile, getTemperature } from "@/lib/auth";
import type { ChatMessage } from "@/lib/chat";
import { CATEGORY_EMOJI, formatPrice, imageUrl, type Category } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "채팅방 | 고구마마켓" };

type RoomRow = {
  id: number;
  seller_id: string;
  buyer_id: string;
  product: { id: number; title: string; price: number; images: string[]; category: Category } | null;
  seller: { nickname: string; avatar_path: string | null } | null;
  buyer: { nickname: string; avatar_path: string | null } | null;
};

async function Room({ id }: { id: string }) {
  if (!/^\d+$/.test(id)) notFound();
  const me = await getCurrentProfile();
  if (!me) redirect("/login");

  const supabase = await createClient();
  // RLS 때문에 내가 참여한 방만 보인다
  const { data: room } = await supabase
    .from("goguma_chat_rooms")
    .select(
      "id, seller_id, buyer_id, " +
        "product:goguma_products(id, title, price, images, category), " +
        "seller:goguma_profiles!goguma_chat_rooms_seller_id_fkey(nickname, avatar_path), " +
        "buyer:goguma_profiles!goguma_chat_rooms_buyer_id_fkey(nickname, avatar_path)",
    )
    .eq("id", Number(id))
    .returns<RoomRow[]>()
    .maybeSingle();
  if (!room) notFound();

  const otherId = room.seller_id === me.id ? room.buyer_id : room.seller_id;
  const other = (room.seller_id === me.id ? room.buyer : room.seller) ?? { nickname: "이웃", avatar_path: null };

  const [{ data: messages }, temperature] = await Promise.all([
    supabase
      .from("goguma_chat_messages")
      .select("id, room_id, sender_id, body, created_at")
      .eq("room_id", room.id)
      .order("created_at", { ascending: true })
      .limit(300)
      .returns<ChatMessage[]>(),
    getTemperature(otherId),
  ]);

  return (
    <div className="flex h-[calc(100dvh-8rem-env(safe-area-inset-bottom))] flex-col overflow-hidden rounded-none border-goguma-900 bg-white sm:rounded-[2rem] sm:border-4 sm:shadow-[6px_6px_0_#3d1638] md:h-[calc(100dvh-7rem)]">
      {/* 상대방 */}
      <div className="flex items-center gap-3 border-b-2 border-goguma-100 px-3 py-2.5 sm:px-5">
        <Link href="/chats" aria-label="채팅 목록으로" className="text-xl text-goguma-700">
          ←
        </Link>
        <Link href={`/users/${otherId}`} className="flex min-w-0 flex-1 items-center gap-2">
          <Avatar path={other.avatar_path} nickname={other.nickname} size={36} />
          <span className="truncate font-display text-goguma-900">{other.nickname}</span>
        </Link>
        <MannerTemperatureBadge value={temperature} />
      </div>

      {/* 어떤 판매글 얘기인지 */}
      {room.product && (
        <Link
          href={`/products/${room.product.id}`}
          className="flex items-center gap-3 border-b-2 border-goguma-100 bg-flesh-100/60 px-3 py-2 sm:px-5"
        >
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-goguma-100 text-2xl">
            {room.product.images[0] ? (
              <Image src={imageUrl(room.product.images[0])} alt="" fill sizes="44px" className="object-cover" />
            ) : (
              CATEGORY_EMOJI[room.product.category]
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm text-goguma-900">{room.product.title}</span>
            <span className="block font-display text-goguma-700">{formatPrice(room.product.price)}</span>
          </span>
        </Link>
      )}

      <ChatRoom roomId={room.id} myId={me.id} otherNickname={other.nickname} initialMessages={messages ?? []} />
    </div>
  );
}

export default function ChatRoomPage({ params }: PageProps<"/chats/[id]">) {
  return (
    <div className="bg-goguma-dots flex-1 sm:px-4 sm:py-4">
      <div className="mx-auto max-w-2xl">
        <Suspense fallback={<div className="h-[70dvh] animate-pulse bg-goguma-50 sm:rounded-[2rem]" />}>
          {params.then(({ id }) => (
            <Room id={id} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
