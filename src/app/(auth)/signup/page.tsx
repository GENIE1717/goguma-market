import type { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "회원가입 | 고구마마켓" };

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-flesh-500">JOIN US</p>
        <h1 className="font-display text-4xl text-goguma-800">고구마 가족이 되어 주세요</h1>
        <p className="mt-1 text-goguma-500">가입하면 우리 동네 달콤한 거래를 시작할 수 있어요. 🍠</p>
      </div>
      <SignupForm />
    </div>
  );
}
