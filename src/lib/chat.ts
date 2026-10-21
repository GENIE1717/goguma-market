import { createClient } from "@/lib/supabase/server";

export type ChatRoomSummary = {
  id: number;
  product_id: number;
  product_title: string;
  product_image: string | null;
  other_id: string;
  other_nickname: string;
  other_avatar: string | null;
  last_message: string | null;
  last_message_at: string;
  unread: number;
};

export type ChatMessage = {
  id: number;
  room_id: number;
  sender_id: string;
  body: string;
  created_at: string;
};

// 내 채팅방 목록 (로그아웃 상태면 빈 목록)
export async function getMyChatRooms(): Promise<ChatRoomSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("goguma_my_chat_rooms");
  return (data ?? []).map((room: ChatRoomSummary) => ({ ...room, unread: Number(room.unread) }));
}

// 안 읽은 메시지 총 개수 (메뉴 배지용)
export async function getUnreadTotal(): Promise<number> {
  const rooms = await getMyChatRooms();
  return rooms.reduce((sum, room) => sum + room.unread, 0);
}
