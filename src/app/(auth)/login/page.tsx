import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "로그인 | 고구마마켓" };

// ?error=confirm 은 인증 메일 링크 처리에 실패했을 때 /auth/callback 이 붙여 준다
async function LoginFormWithParams({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const initialError =
    error === "confirm" ? "인증 링크가 만료됐거나 잘못됐어요. 다시 가입하거나 로그인해 주세요." : undefined;
  return <LoginForm initialError={initialError} />;
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-flesh-500">WELCOME BACK</p>
        <h1 className="font-display text-4xl text-goguma-800">다시 왔구마! 🍠</h1>
        <p className="mt-1 text-goguma-500">로그인하고 동네 고구마 소식을 확인하세요.</p>
      </div>
      <Suspense>
        <LoginFormWithParams searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
