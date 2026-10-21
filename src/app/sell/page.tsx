import type { Metadata } from "next";
import { SellForm } from "./sell-form";

export const metadata: Metadata = { title: "판매글 쓰기 | 고구마마켓" };

// 로그인 안 한 사람은 proxy 에서 /login 으로 보낸다
export default function SellPage() {
  return (
    <div className="bg-goguma-dots flex flex-1 justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6 rounded-[2rem] border-4 border-goguma-900 bg-white p-8 shadow-[8px_8px_0_#3d1638] sm:p-10">
        <div>
          <p className="font-display text-flesh-500">SELL</p>
          <h1 className="font-display text-4xl text-goguma-800">내 물건 팔기</h1>
          <p className="mt-1 text-goguma-500">우리 동네 이웃에게 달콤하게 소개해 주세요. 🍠</p>
        </div>
        <SellForm />
      </div>
    </div>
  );
}
