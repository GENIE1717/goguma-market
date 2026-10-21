import { Carrot, Goguma } from "@/components/characters";
import { BattleCommentary } from "@/components/battle-commentary";

function HpBar({ label, percent, color, danger = false }: { label: string; percent: number; color: string; danger?: boolean }) {
  return (
    <div>
      <div className="mb-1 flex justify-between font-display text-sm text-white sm:text-base">
        <span>{label}</span>
        <span className={danger ? "animate-blink text-red-300" : ""}>HP {percent}%</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full border-2 border-white/80 bg-black/40">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

// 고구마 vs 당근 — 동네 패권 전쟁
export function BattleArena() {
  return (
    <section className="relative overflow-hidden bg-goguma-900 px-4 py-14 text-white">
      {/* 링 조명 */}
      <div aria-hidden className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-goguma-500/40 blur-3xl" />
      <div aria-hidden className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-carrot-500/30 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <p className="text-center font-display text-flesh-300">⚔️ 오늘의 메인 이벤트 ⚔️</p>
        <h2 className="mt-1 text-center font-display text-4xl sm:text-5xl">
          <span className="text-goguma-300">고구마</span>
          <span className="mx-3 text-flesh-400">VS</span>
          <span className="text-carrot-400">당근</span>
        </h2>
        <p className="mt-2 text-center text-white/70">동네 마켓 패권을 건 세기의 대결. 승자는 이미 정해졌다.</p>

        <div className="mt-8 grid grid-cols-2 gap-6 sm:gap-16">
          <HpBar label="🍠 고구마 (챔피언)" percent={98} color="bg-gradient-to-r from-goguma-400 to-flesh-400" />
          <HpBar label="🥕 당근 (도전자)" percent={7} color="bg-carrot-500" danger />
        </div>

        {/* 링 */}
        <div className="relative mt-6 flex items-end justify-center gap-2 rounded-3xl border-4 border-flesh-400 bg-gradient-to-b from-goguma-800 to-goguma-900 px-4 pb-6 pt-10 sm:gap-10">
          <div className="animate-punch-right">
            <Goguma mood="angry" fist className="w-40 drop-shadow-[0_8px_0_rgba(0,0,0,0.35)] sm:w-64" />
          </div>

          <div className="relative mb-10 flex flex-col items-center">
            <span className="animate-pop absolute -top-14 text-5xl">💥</span>
            <span className="font-display text-5xl text-flesh-400 drop-shadow-[3px_3px_0_#a54497] sm:text-7xl">VS</span>
            <span className="text-3xl">⚡</span>
          </div>

          <div className="animate-knockback origin-bottom">
            <Carrot mood="defeated" className="h-40 drop-shadow-[0_8px_0_rgba(0,0,0,0.35)] sm:h-60" />
          </div>

          <div className="absolute bottom-2 left-4 rounded-full bg-black/40 px-3 py-1 text-xs text-white/80">
            통산 전적 🍠 128승 0패 · 🥕 0승 128패
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-2xl">
          <BattleCommentary />
        </div>
      </div>
    </section>
  );
}
