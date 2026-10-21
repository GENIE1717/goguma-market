import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Avatar } from "@/components/avatar";
import { getMyChatRooms } from "@/lib/chat";
import { imageUrl } from "@/lib/products";

export const metadata: Metadata = { title: "채팅 | 고구마마켓" };

function timeAgo(iso: string) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}시간 전`;
  return `${Math.floor(minutes / 60 / 24)}일 전`;
}

async function ChatList() {
  const rooms = await getMyChatRooms();

  if (rooms.length === 0) {
    return (
      <div className="rounded-3xl border-4 border-dashed border-goguma-300 bg-white/70 p-10 text-center">
        <p className="text-5xl">💬🍠</p>
        <p className="mt-3 font-display text-xl text-goguma-800">아직 채팅이 없어요.</p>
        <p className="mt-1 text-sm text-goguma-500">마음에 드는 매물에서 💬 채팅하기를 눌러 보세요.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y-2 divide-goguma-100 overflow-hidden rounded-3xl border-4 border-goguma-900 bg-white shadow-[6px_6px_0_#3d1638]">
      {rooms.map((room) => (
        <li key={room.id}>
          <Link href={`/chats/${room.id}`} className="flex items-center gap-3 p-4 transition hover:bg-goguma-50">
            <Avatar path={room.other_avatar} nickname={room.other_nickname} size={48} />
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline gap-2">
                <span className="truncate font-display text-goguma-900">{room.other_nickname}</span>
                <span className="shrink-0 text-xs text-goguma-400">{timeAgo(room.last_message_at)}</span>
              </p>
              <p className="truncate text-sm text-goguma-600">{room.last_message ?? "채팅방이 열렸어요. 먼저 인사해 보세요 👋"}</p>
              <p className="truncate text-xs text-goguma-400">🧺 {room.product_title}</p>
            </div>
            {room.unread > 0 && (
              <span className="min-w-6 rounded-full bg-carrot-500 px-1.5 text-center text-xs font-bold leading-6 text-white">
                {room.unread}
              </span>
            )}
            {room.product_image && (
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 border-goguma-100">
                <Image src={imageUrl(room.product_image)} alt="" fill sizes="48px" className="object-cover" />
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function ChatsPage() {
  return (
    <div className="bg-goguma-dots flex-1 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-display text-3xl text-goguma-800 sm:text-4xl">💬 채팅</h1>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl border-4 border-goguma-200 bg-goguma-50" />}>
          <ChatList />
        </Suspense>
      </div>
    </div>
  );
}
