import { Carrot, Goguma } from "@/components/characters";

// 로그인/회원가입 공통 레이아웃: 왼쪽엔 고구마가 당근을 혼내는 그림, 오른쪽엔 폼
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-goguma-dots flex flex-1 items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border-4 border-goguma-900 bg-white shadow-[8px_8px_0_#3d1638] md:grid-cols-2">
        <aside className="relative hidden flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-goguma-600 to-goguma-800 p-10 text-white md:flex">
          <p className="font-display text-3xl leading-snug text-center drop-shadow-[2px_2px_0_#3d1638]">
            이곳은 <span className="text-flesh-300">고구마</span>의 땅.
            <br />
            당근은 돌아가라! 🍠
          </p>

          <div className="relative flex items-end gap-2">
            <div className="animate-punch-right">
              <Goguma mood="angry" fist className="w-52" />
            </div>
            <span className="animate-pop absolute left-1/2 top-0 text-4xl">💥</span>
            <div className="animate-knockback origin-bottom">
              <Carrot mood="defeated" className="h-36" />
            </div>
          </div>

          <ul className="space-y-1 text-sm text-goguma-100">
            <li>✔ 우리 동네 달콤한 중고거래</li>
            <li>✔ 군고구마처럼 따뜻한 이웃 인증</li>
            <li>✔ 당근 없는 청정 구역</li>
          </ul>
        </aside>

        <div className="relative p-8 sm:p-10">
          {/* 폼 구석에서 몰래 들어오려는 당근 */}
          <div className="absolute -right-3 top-10 rotate-[-25deg] md:hidden">
            <Carrot mood="sneaky" className="h-16" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
