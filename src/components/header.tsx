import Link from "next/link";
import { Suspense } from "react";
import { Goguma } from "@/components/characters";
import { getCurrentProfile } from "@/lib/auth";
import { logout } from "@/app/auth/actions";

// 로그인 상태에 따라 바뀌는 오른쪽 영역 (쿠키를 읽으므로 Suspense 안에서 렌더링)
async function UserMenu() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-full px-4 py-2 font-display text-goguma-800 transition hover:bg-goguma-100"
        >
          로그인
        </Link>
        <Link
          href="/signup"
          className="rounded-full border-2 border-goguma-900 bg-flesh-400 px-4 py-2 font-display text-goguma-900 shadow-[3px_3px_0_#3d1638] transition hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#3d1638]"
        >
          회원가입
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="hidden text-right leading-tight sm:block">
        <p className="font-display text-goguma-800">🍠 {profile.nickname}님</p>
        <p className="text-xs text-goguma-500">📍 {profile.neighborhood}</p>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="rounded-full border-2 border-goguma-300 px-4 py-2 font-display text-goguma-700 transition hover:border-goguma-700 hover:bg-goguma-50"
        >
          로그아웃
        </button>
      </form>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b-4 border-goguma-900 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="group flex items-center gap-2">
          <Goguma mood="wink" className="w-14 transition group-hover:animate-wiggle" />
          <span className="font-display text-2xl text-goguma-700 sm:text-3xl">
            고구마<span className="text-flesh-500">마켓</span>
          </span>
        </Link>

        <span className="hidden rotate-[-4deg] rounded-md border-2 border-dashed border-carrot-500 px-2 py-0.5 font-display text-sm text-carrot-500 md:inline-block">
          🚫🥕 당근 출입금지
        </span>

        <Suspense fallback={<div className="h-10 w-36 animate-pulse rounded-full bg-goguma-100" />}>
          <UserMenu />
        </Suspense>
      </div>
    </header>
  );
}
