"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", icon: "🏠", label: "홈" },
  { href: "/search", icon: "🔍", label: "검색" },
  { href: "/sell", icon: "✏️", label: "글쓰기" },
  { href: "/chats", icon: "💬", label: "채팅" },
  { href: "/me", icon: "🍠", label: "내 정보" },
];

// 휴대폰 화면(768px 미만)에서만 보이는 아래쪽 탭 메뉴. PC 의 위쪽 메뉴와 같은 기능.
// pathname 이 없으면(불러오는 중) 아무 탭도 강조하지 않는다.
export function BottomNavLinks({ pathname, unread = 0 }: { pathname?: string; unread?: number }) {
  return (
    <nav
      aria-label="아래 메뉴"
      className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-goguma-900 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-5">
        {TABS.map((tab) => {
          const active = pathname !== undefined && (tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href));
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-0.5 py-2 text-xs ${
                  active ? "font-display text-goguma-800" : "text-goguma-400"
                }`}
              >
                <span className={`text-xl transition ${active ? "scale-110" : "grayscale-[60%]"}`}>{tab.icon}</span>
                {tab.label}
                {tab.href === "/chats" && unread > 0 && (
                  <span className="absolute right-[22%] top-1 min-w-5 rounded-full bg-carrot-500 px-1 text-center text-[10px] font-bold leading-5 text-white">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// 지금 주소를 읽어 현재 탭을 강조한다 (반드시 <Suspense> 안에서 렌더링)
export function BottomNav({ unread = 0 }: { unread?: number }) {
  const pathname = usePathname();
  return <BottomNavLinks pathname={pathname} unread={unread} />;
}
