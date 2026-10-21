"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup, type AuthState } from "@/app/auth/actions";
import { Field, FormMessage, SubmitButton } from "@/components/form-ui";
import { RegionSelect } from "@/components/region-select";

export function SignupForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(signup, {});

  // 인증 메일을 보냈으면 폼 대신 안내만 보여 준다
  if (state.message) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-6xl">📬🍠</p>
        <FormMessage message={state.message} />
        <p className="text-sm text-goguma-500">메일이 안 보이면 스팸함도 확인해 주세요.</p>
        <Link href="/login" className="inline-block font-display text-goguma-700 underline decoration-flesh-400 decoration-4 underline-offset-4">
          로그인하러 가기
        </Link>
      </div>
    );
  }

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
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="비밀번호"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="6자 이상"
          minLength={6}
          required
        />
        <Field
          label="비밀번호 확인"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          placeholder="한 번 더"
          minLength={6}
          required
        />
      </div>
      <Field
        label="닉네임"
        name="nickname"
        placeholder="달콤한호박고구마"
        minLength={2}
        maxLength={12}
        defaultValue={state.fields?.nickname}
        hint="2~12자"
        required
      />
      <RegionSelect defaultValue={state.fields} />

      {/* 캡차 대신 당근 판별기 */}
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-carrot-400 bg-flesh-100 px-4 py-3">
        <input type="checkbox" name="notCarrot" className="h-5 w-5 accent-goguma-600" required />
        <span className="font-display text-goguma-800">저는 당근이 아닙니다 🥕❌</span>
      </label>

      <FormMessage error={state.error} />

      <SubmitButton pending={pending}>고구마 가족 되기 🍠</SubmitButton>

      <p className="text-center text-sm text-goguma-500">
        이미 회원이신가요?{" "}
        <Link href="/login" className="font-display text-goguma-700 underline decoration-flesh-400 decoration-4 underline-offset-4">
          로그인
        </Link>
      </p>
    </form>
  );
}
