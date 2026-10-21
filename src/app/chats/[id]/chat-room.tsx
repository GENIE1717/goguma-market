"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/chat";
import { createClient } from "@/lib/supabase/client";

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Seoul" });
}

function dayOf(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short", timeZone: "Asia/Seoul" });
}

// 채팅방: 새 메시지는 Supabase Realtime 으로 바로 받는다
export function ChatRoom({
  roomId,
  myId,
  otherNickname,
  initialMessages,
}: {
  roomId: number;
  myId: string;
  otherNickname: string;
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // 같은 메시지가 두 번 들어오지 않게 id 로 합친다
  function addMessage(message: ChatMessage) {
    setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
  }

  // 실시간 구독 + 들어오면 읽음 표시
  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    void (async () => {
      // 실시간 연결에 내 로그인 정보를 먼저 실어 보낸다.
      // (안 그러면 "로그아웃 사용자"로 붙어서 RLS 때문에 메시지를 못 받는다)
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) await supabase.realtime.setAuth(data.session.access_token);
      void supabase.rpc("goguma_mark_chat_read", { target_room: roomId });

      channel = supabase
        .channel(`chat-room-${roomId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "goguma_chat_messages", filter: `room_id=eq.${roomId}` },
          (payload) => {
            addMessage(payload.new as ChatMessage);
            void supabase.rpc("goguma_mark_chat_read", { target_room: roomId });
          },
        )
        .subscribe();
    })();

    return () => {
      cancelled = true;
      if (channel) void supabase.removeChannel(channel);
    };
  }, [roomId]);

  // 새 메시지가 오면 맨 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text || sending) return;
    setSending(true);
    setError("");
    const { data, error } = await createClient()
      .from("goguma_chat_messages")
      .insert({ room_id: roomId, body: text })
      .select("id, room_id, sender_id, body, created_at")
      .single();
    setSending(false);
    if (error || !data) {
      setError("메시지를 보내지 못했어요. 다시 시도해 주세요.");
      return;
    }
    addMessage(data);
    setBody("");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-goguma-50/60 px-3 py-4 sm:px-5">
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-goguma-500">
            {otherNickname}님에게 첫 인사를 건네 보세요 👋
            <br />
            예: &ldquo;안녕하세요! 아직 판매 중인가요?&rdquo;
          </p>
        )}
        {messages.map((m, i) => {
          const mine = m.sender_id === myId;
          const newDay = i === 0 || dayOf(messages[i - 1].created_at) !== dayOf(m.created_at);
          return (
            <div key={m.id}>
              {newDay && <p className="my-3 text-center text-xs text-goguma-400">— {dayOf(m.created_at)} —</p>}
              <div className={`flex items-end gap-1.5 ${mine ? "flex-row-reverse" : ""}`}>
                <p
                  className={`max-w-[75%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-[15px] leading-snug ${
                    mine
                      ? "rounded-br-sm bg-goguma-600 text-white"
                      : "rounded-bl-sm border-2 border-goguma-100 bg-white text-goguma-900"
                  }`}
                >
                  {m.body}
                </p>
                <span className="shrink-0 text-[10px] text-goguma-400">{timeOf(m.created_at)}</span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="flex items-end gap-2 border-t-2 border-goguma-100 bg-white p-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            // Enter 로 보내기, Shift+Enter 는 줄바꿈 (한글 조합 중에는 무시)
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          rows={1}
          maxLength={1000}
          placeholder="메시지 보내기"
          aria-label="메시지"
          className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border-2 border-goguma-200 bg-goguma-50/50 px-4 py-2.5 text-goguma-900 outline-none focus:border-goguma-500 focus:bg-white"
        />
        <button
          type="submit"
          disabled={sending || !body.trim()}
          className="h-11 shrink-0 rounded-2xl border-2 border-goguma-900 bg-goguma-600 px-4 font-display text-white transition disabled:opacity-40"
        >
          보내기
        </button>
      </form>
      {error && <p className="bg-white px-3 pb-2 text-xs text-carrot-500">{error}</p>}
    </div>
  );
}
