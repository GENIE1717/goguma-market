import Link from "next/link";
import { Suspense } from "react";
import { BattleArena } from "@/components/battle-arena";
import { Carrot, Goguma } from "@/components/characters";
import { FallingGoguma, NewsTicker, Wave } from "@/components/decorations";
import { getCurrentProfile } from "@/lib/auth";

// 예시 매물 — 상품 기능은 다음 단계에서 DB로 옮길 예정
const SAMPLE_ITEMS = [
  { emoji: "🍠", title: "해남 꿀고구마 1박스 (3kg)", place: "고구마동", price: 15000, likes: 42, bg: "from-goguma-200 to-goguma-100" },
  { emoji: "🔥", title: "군고구마 기계 거의 새것", place: "군밤로", price: 89000, likes: 17, bg: "from-flesh-300 to-flesh-100" },
  { emoji: "🛋️", title: "고구마 모양 대형 쿠션", place: "호박동", price: 12000, likes: 33, bg: "from-goguma-300 to-flesh-200" },
  { emoji: "🚫🥕", title: "당근 퇴치 스프레이 (효과 확실)", place: "밤고구마리", price: 4900, likes: 128, bg: "from-carrot-400/40 to-flesh-100" },
  { emoji: "🌱", title: "밤고구마 모종 10주", place: "자색동", price: 8000, likes: 9, bg: "from-leaf-500/30 to-flesh-100" },
  { emoji: "🍯", title: "수제 고구마 말랭이 500g", place: "고구마동", price: 6500, likes: 56, bg: "from-flesh-400 to-flesh-100" },
];

const SPEC = [
  { label: "당도", goguma: "🍯🍯🍯🍯🍯", carrot: "🍯", win: "goguma" },
  { label: "겨울철 인기", goguma: "군고구마 대란", carrot: "…?", win: "goguma" },
  { label: "구워 먹기", goguma: "가능 (최고)", carrot: "애매함", win: "goguma" },
  { label: "토끼 선호도", goguma: "좋아함", carrot: "매우 좋아함", win: "carrot" },
  { label: "든든함", goguma: "한 개면 한 끼", carrot: "간식 정도", win: "goguma" },
];

// 로그인 여부에 따라 바뀌는 히어로 버튼 영역
async function HeroActions({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const [profile, { welcome }] = await Promise.all([getCurrentProfile(), searchParams]);

  if (profile) {
    return (
      <div className="space-y-3">
        {welcome && (
          <p className="inline-block rounded-full bg-leaf-500 px-4 py-1 font-display text-white">
            🎉 고구마 가족이 된 걸 환영해요!
          </p>
        )}
        <p className="font-display text-2xl text-flesh-200">
          {profile.nickname}님, 오늘도 달콤한 하루 보내세요 🍠
        </p>
        <p className="text-goguma-100">📍 {profile.neighborhood}의 따끈한 매물이 곧 올라와요. (거래 기능은 다음 단계에서!)</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/signup"
        className="rounded-2xl border-4 border-goguma-900 bg-flesh-400 px-6 py-3 font-display text-xl text-goguma-900 shadow-[5px_5px_0_#3d1638] transition hover:-translate-y-1 hover:shadow-[6px_8px_0_#3d1638]"
      >
        🍠 고구마 회원 되기
      </Link>
      <Link
        href="/login"
        className="rounded-2xl border-4 border-white bg-white/10 px-6 py-3 font-display text-xl text-white transition hover:bg-white/20"
      >
        로그인
      </Link>
    </div>
  );
}

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <>
      {/* 히어로 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-goguma-700 via-goguma-600 to-goguma-800 px-4 pb-16 pt-14 text-white">
        <FallingGoguma />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <p className="inline-block -rotate-2 rounded-lg bg-flesh-300 px-3 py-1 font-display text-goguma-900">
              ✨ 대한민국 1등 고구마 중고거래 (자체 조사)
            </p>
            <h1 className="font-display text-5xl leading-tight drop-shadow-[3px_3px_0_#3d1638] sm:text-6xl">
              달콤한 동네 거래,
              <br />
              <span className="text-flesh-300">고구마마켓</span> 🍠
            </h1>
            <p className="max-w-lg text-lg text-goguma-100">
              당근보다 달고, 당근보다 따뜻하다.
              <br />
              군고구마처럼 따끈한 이웃과 믿을 수 있는 거래를 시작해 보세요.
            </p>
            <Suspense fallback={<div className="h-16 w-72 animate-pulse rounded-2xl bg-white/20" />}>
              <HeroActions searchParams={searchParams} />
            </Suspense>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            {/* 군고구마 김 */}
            <div aria-hidden className="absolute -top-6 left-1/2 flex -translate-x-1/2 gap-6">
              {[0, 0.8, 1.6].map((delay) => (
                <span
                  key={delay}
                  className="block h-10 w-3 animate-steam rounded-full bg-white/60 blur-[2px]"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
            <div className="animate-float">
              <Goguma mood="cool" className="w-full drop-shadow-[0_18px_0_rgba(0,0,0,0.25)]" />
            </div>
            {/* 구석에서 째려보는 당근 */}
            <div className="absolute -bottom-8 -right-4 animate-wiggle">
              <Carrot mood="angry" className="h-28" />
              <span className="absolute -left-28 -top-4 rounded-xl border-2 border-goguma-900 bg-white px-2 py-1 font-display text-sm text-carrot-500 shadow">
                나도 끼워줘…!
              </span>
            </div>
          </div>
        </div>
      </section>

      <NewsTicker />

      {/* 예시 매물 */}
      <section className="bg-goguma-dots px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-3xl text-goguma-800 sm:text-4xl">🔥 지금 동네에서 뜨끈한 매물</h2>
              <p className="mt-1 text-goguma-500">예시 매물이에요 · 진짜 거래 기능은 다음 단계에서 오픈!</p>
            </div>
            <span className="rounded-full bg-goguma-100 px-3 py-1 font-display text-sm text-goguma-700">🍠 준비 중</span>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
            {SAMPLE_ITEMS.map((item) => (
              <li
                key={item.title}
                className="group overflow-hidden rounded-3xl border-4 border-goguma-900 bg-white shadow-[5px_5px_0_#3d1638] transition hover:-translate-y-1 hover:rotate-[-1deg]"
              >
                <div className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${item.bg} text-6xl transition group-hover:scale-105`}>
                  {item.emoji}
                </div>
                <div className="space-y-1 p-4">
                  <p className="line-clamp-1 font-display text-lg text-goguma-900">{item.title}</p>
                  <p className="text-sm text-goguma-400">📍 {item.place}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xl text-goguma-700">{item.price.toLocaleString("ko-KR")}원</p>
                    <p className="text-sm text-goguma-400">💜 {item.likes}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Wave fill="#3d1638" />
      <BattleArena />
      <Wave fill="#3d1638" flip />

      {/* 스펙 비교 */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl text-goguma-800 sm:text-4xl">📊 공정한 스펙 비교</h2>
          <p className="mt-1 text-center text-goguma-500">고구마마켓 연구소가 아주 객관적으로 조사했습니다.</p>

          <div className="mt-8 overflow-hidden rounded-3xl border-4 border-goguma-900 bg-white shadow-[6px_6px_0_#3d1638]">
            <div className="grid grid-cols-3 bg-goguma-700 font-display text-lg text-white">
              <span className="p-3 text-center">항목</span>
              <span className="p-3 text-center">🍠 고구마</span>
              <span className="p-3 text-center">🥕 당근</span>
            </div>
            {SPEC.map((row) => (
              <div key={row.label} className="grid grid-cols-3 border-t-2 border-goguma-100 text-center">
                <span className="p-3 font-display text-goguma-800">{row.label}</span>
                <span className={`p-3 ${row.win === "goguma" ? "bg-flesh-100 font-display text-goguma-800" : "text-goguma-400"}`}>
                  {row.goguma} {row.win === "goguma" && "👑"}
                </span>
                <span className={`p-3 ${row.win === "carrot" ? "bg-carrot-400/20 font-display text-carrot-500" : "text-goguma-400"}`}>
                  {row.carrot} {row.win === "carrot" && "👑"}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-sm text-goguma-400">* 토끼 선호도는 인정합니다.</p>
        </div>
      </section>
    </>
  );
}
