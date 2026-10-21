import { Carrot, Goguma } from "@/components/characters";

// 말풍선
function Bubble({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`absolute whitespace-nowrap rounded-lg border-2 border-goguma-900 bg-white px-1.5 py-0.5 font-display text-[11px] leading-tight text-goguma-900 ${className}`}
    >
      {children}
    </span>
  );
}

// 화면 양옆 여백이 넉넉할 때(넓은 화면)만 보이는 싸움
const SIDE = "hidden min-[1360px]:flex";

// 홈 배경 군데군데에서 벌어지는 작은 고구마 vs 당근 싸움들
// 화면 뒤에 깔리기만 하고 클릭은 막지 않는다
export function BattleBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {/* 1. 고구마 펀치에 당근이 튕겨 나감 */}
      <div className={`${SIDE} absolute left-[1%] top-[14%] items-end opacity-60`}>
        <div className="animate-punch-right">
          <Goguma mood="angry" fist className="w-20" />
        </div>
        <span className="animate-pop absolute left-16 top-0 text-xl">💥</span>
        <div className="animate-knockback origin-bottom">
          <Carrot mood="defeated" className="h-14" />
        </div>
        <Bubble className="-top-5 left-0">당근 OUT!</Bubble>
      </div>

      {/* 2. 백기 들고 도망치는 당근, 뒤쫓는 고구마 */}
      <div className={`${SIDE} absolute right-[1%] top-[28%] opacity-60`}>
        <div className="animate-flee flex items-end gap-1">
          <div className="relative">
            <Carrot mood="angry" className="h-14 -scale-x-100" />
            <span className="absolute -left-3 -top-2 text-lg">🏳️</span>
            <span className="absolute -right-2 top-1 text-sm">💦</span>
            <Bubble className="-top-6 left-2">항복…!</Bubble>
          </div>
          <Goguma mood="angry" className="w-16 -scale-x-100" />
        </div>
      </div>

      {/* 3. K.O. 당한 당근 옆에서 선글라스 고구마 */}
      <div className={`${SIDE} absolute left-[1%] top-[48%] items-end gap-1 opacity-60`}>
        <Goguma mood="cool" className="w-20 animate-wiggle" />
        <div className="relative">
          <Carrot mood="defeated" className="h-14 rotate-90" />
          <span className="absolute -top-3 left-3 text-sm">💫</span>
        </div>
        <Bubble className="-top-5 left-14 text-carrot-500">K.O.</Bubble>
      </div>

      {/* 4. 몰래 판매글 올리려는 당근, 막아서는 고구마 */}
      <div className={`${SIDE} absolute right-[1%] top-[62%] items-end gap-1 opacity-60`}>
        <Carrot mood="sneaky" className="h-14 rotate-[-12deg]" />
        <Goguma mood="angry" className="w-16 -scale-x-100" />
        <span className="absolute -top-4 right-4 text-lg">🚫</span>
        <Bubble className="-top-6 left-0">나도 팔래…</Bubble>
      </div>

      {/* 5. 하늘에서 떨어지는 고구마 메테오 (어느 화면에서나 맨 아래 빈 곳에) */}
      <div className="absolute bottom-6 left-[4%] flex items-end gap-2 opacity-60">
        <span className="animate-meteor text-2xl">☄️🍠</span>
        <Carrot mood="angry" className="h-14 animate-wiggle" />
        <Bubble className="-top-5 left-8">어어어…?!</Bubble>
      </div>

      {/* 6. 좁은 화면에서도 보이는 펀치 한 방 (맨 아래 오른쪽) */}
      <div className="absolute bottom-6 right-[4%] flex items-end opacity-60 min-[1360px]:hidden">
        <div className="animate-punch-right">
          <Goguma mood="angry" fist className="w-16" />
        </div>
        <span className="animate-pop absolute left-12 top-0 text-lg">💥</span>
        <div className="animate-knockback origin-bottom">
          <Carrot mood="defeated" className="h-12" />
        </div>
        <Bubble className="-top-5 left-0">당근 OUT!</Bubble>
      </div>
    </div>
  );
}
