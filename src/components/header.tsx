import Link from "next/link";
import { Suspense } from "react";
import { Avatar } from "@/components/avatar";
import { BottomNav, BottomNavLinks } from "@/components/bottom-nav";
import { Goguma } from "@/components/characters";
import { getCurrentProfile } from "@/lib/auth";
import { getUnreadTotal } from "@/lib/chat";

const pill =
  "rounded-full border-2 border-goguma-900 bg-flesh-400 px-4 py-2 font-display text-goguma-900 shadow-[3px_3px_0_#3d1638] transition hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#3d1638]";

function UnreadBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-carrot-500 px-1 text-center text-[10px] font-bold leading-5 text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

// 로그인 상태에 따라 바뀌는 오른쪽 영역 (쿠키를 읽으므로 Suspense 안에서 렌더링)
async function UserMenu() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Link href="/login" className="rounded-full px-3 py-2 font-display text-goguma-800 transition hover:bg-goguma-100">
          로그인
        </Link>
        <Link href="/signup" className={pill}>
          회원가입
        </Link>
      </div>
    );
  }

  const unread = await getUnreadTotal();

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* PC 메뉴 — 휴대폰에서는 아래쪽 탭 메뉴가 같은 역할 */}
      <Link href="/sell" className={`hidden md:inline-block ${pill}`}>
        판매하기
      </Link>
      <Link
        href="/chats"
        aria-label="채팅"
        className="relative hidden h-11 w-11 items-center justify-center rounded-full border-2 border-goguma-300 text-xl transition hover:border-goguma-700 md:flex"
      >
        💬
        <UnreadBadge count={unread} />
      </Link>
      <Link href="/me" className="flex items-center gap-2 rounded-full transition hover:opacity-80" aria-label="내 정보">
        <span className="hidden text-right leading-tight lg:block">
          <span className="block font-display text-goguma-800">{profile.nickname}님</span>
          <span className="block text-xs text-goguma-500">내 정보</span>
        </span>
        <Avatar path={profile.avatar_path} nickname={profile.nickname} size={40} />
      </Link>
    </div>
  );
}

async function BottomNavWithBadge() {
  const unread = await getUnreadTotal();
  return <BottomNav unread={unread} />;
}

export function Header() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b-4 border-goguma-900 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <Goguma mood="wink" className="w-12 transition group-hover:animate-wiggle sm:w-14" />
            <span className="font-display text-2xl text-goguma-700 sm:text-3xl">
              고구마<span className="text-flesh-500">마켓</span>
            </span>
          </Link>

          {/* PC 검색창 — 휴대폰은 아래 탭의 '검색' */}
          <form action="/search" className="hidden max-w-sm flex-1 md:block">
            <label className="flex items-center gap-2 rounded-full border-2 border-goguma-200 bg-goguma-50/60 px-4 py-2 focus-within:border-goguma-500 focus-within:bg-white">
              <span aria-hidden>🔍</span>
              <input
                name="q"
                type="search"
                placeholder="고구마, 자전거, 의자…"
                aria-label="판매글 검색"
                className="w-full bg-transparent text-goguma-900 outline-none placeholder:text-goguma-300"
              />
            </label>
          </form>

          <Suspense fallback={<div className="h-10 w-28 animate-pulse rounded-full bg-goguma-100" />}>
            <UserMenu />
          </Suspense>
        </div>
      </header>

      <Suspense fallback={<BottomNavLinks />}>
        <BottomNavWithBadge />
      </Suspense>
    </>
  );
}
