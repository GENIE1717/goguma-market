import Link from "next/link";
import { Suspense } from "react";
import { CategoryChips } from "@/components/category-chips";
import { BattleBackground } from "@/components/decorations";
import { ProductList, ProductListSkeleton } from "@/components/product-list";
import { getCurrentProfile } from "@/lib/auth";

// 로그인 여부·알림에 따라 바뀌는 인사말
async function Greeting({ searchParams }: { searchParams: Promise<{ welcome?: string; deleted?: string }> }) {
  const [profile, { welcome, deleted }] = await Promise.all([getCurrentProfile(), searchParams]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {welcome && profile && (
        <span className="rounded-full bg-leaf-500 px-3 py-1 font-display text-sm text-white">
          🎉 고구마 가족이 된 걸 환영해요!
        </span>
      )}
      {deleted && (
        <span className="rounded-full bg-goguma-100 px-3 py-1 font-display text-sm text-goguma-700">
          🗑️ 판매글을 삭제했어요.
        </span>
      )}
      <span className="text-goguma-500">
        {profile
          ? `🍠 ${profile.nickname}님, 오늘도 달콤한 거래 되세요!`
          : "🚫🥕 당근은 출입 금지, 고구마만 거래 중이에요."}
      </span>
    </div>
  );
}

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <div className="bg-goguma-dots relative flex-1 overflow-hidden">
      <BattleBackground />

      {/* 아래쪽 여백은 배경 싸움 장면 자리 */}
      <section className="relative mx-auto max-w-6xl px-4 pb-32 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-2">
            <h1 className="font-display text-3xl text-goguma-800 sm:text-4xl">🔥 지금 동네에서 뜨끈한 매물</h1>
            <Suspense fallback={<div className="h-6 w-64 animate-pulse rounded-full bg-goguma-100" />}>
              <Greeting searchParams={searchParams} />
            </Suspense>
          </div>
          <Link
            href="/sell"
            className="rounded-full border-2 border-goguma-900 bg-flesh-400 px-5 py-2 font-display text-goguma-900 shadow-[3px_3px_0_#3d1638] transition hover:-translate-y-0.5"
          >
            ✏️ 판매글 쓰기
          </Link>
        </div>

        <div className="mt-5">
          <CategoryChips />
        </div>

        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList />
        </Suspense>
      </section>
    </div>
  );
}
