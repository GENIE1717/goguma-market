"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthState } from "@/app/auth/actions";
import { Field, FormMessage, SubmitButton } from "@/components/form-ui";

export function LoginForm({ initialError }: { initialError?: string }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(login, {
    error: initialError,
  });

  return (
    <form action={formAction} className="space-y-4">
      <Field
        label="이메일"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="goguma@example.com"
        defaultValue={state.fields?.email}
        required
      />
      <Field
        label="비밀번호"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••"
        required
      />

      <FormMessage error={state.error} message={state.message} />

      <SubmitButton pending={pending}>로그인 🍠</SubmitButton>

      <p className="text-center text-sm text-goguma-500">
        아직 고구마 가족이 아니신가요?{" "}
        <Link href="/signup" className="font-display text-goguma-700 underline decoration-flesh-400 decoration-4 underline-offset-4">
          회원가입
        </Link>
      </p>
    </form>
  );
}
