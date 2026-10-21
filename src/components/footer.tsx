import { Carrot, Goguma } from "@/components/characters";

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-goguma-900 px-4 pb-8 pt-12 text-goguma-200">
      {/* 몰래 엿보는 당근 */}
      <Carrot mood="sneaky" className="absolute -bottom-6 right-6 h-28 rotate-[-18deg] opacity-80" />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
        <Goguma mood="happy" className="w-20" />
        <p className="font-display text-2xl text-flesh-300">고구마마켓</p>
        <p className="text-sm">달콤한 이웃 거래, 따끈한 동네 이야기 🍠</p>
        <p className="text-xs text-goguma-400">
          © 2026 고구마마켓 · 개발 공부용 프로젝트 · 당근과는 아무 관계 없습니다 (사이 안 좋음)
        </p>
      </div>
    </footer>
  );
}
