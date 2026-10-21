"use server";

import type { AuthError } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isValidRegion } from "@/lib/regions";
import { createClient } from "@/lib/supabase/server";

// useActionState 로 폼에 돌려줄 상태
export type AuthState = {
  error?: string;
  message?: string;
  // 에러가 나도 입력값이 지워지지 않도록 돌려준다 (비밀번호 제외)
  fields?: Record<string, string>;
};

// Supabase 에러 코드를 한국어 고구마 말투로 바꿔 준다
function toKoreanError(error: AuthError): string {
  switch (error.code) {
    case "invalid_credentials":
      return "이메일 또는 비밀번호가 틀렸구마. 다시 확인해 주세요.";
    case "email_not_confirmed":
      return "아직 이메일 인증을 안 했구마! 메일함을 확인해 주세요. 📬";
    case "user_already_exists":
    case "email_exists":
      return "이미 가입된 이메일이에요. 로그인해 주세요.";
    case "weak_password":
      return "비밀번호가 너무 약해요. 6자 이상, 더 단단한 고구마처럼!";
    case "email_address_invalid":
      return "사용할 수 없는 이메일 주소예요.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "요청이 너무 많아요. 고구마 한 입 드시고 잠시 후 다시 시도해 주세요.";
    case "signup_disabled":
      return "지금은 회원가입이 막혀 있어요.";
    default:
      return `문제가 생겼어요: ${error.message}`;
  }
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

// 회원가입
export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = text(formData, "email");
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const nickname = text(formData, "nickname");
  const sido = text(formData, "sido");
  const sgg = text(formData, "sgg");
  const dong = text(formData, "dong");
  const notCarrot = formData.get("notCarrot") === "on";
  const fields = { email, nickname, sido, sgg, dong };

  // 서버에서도 꼭 다시 검사한다 (브라우저 검사는 우회할 수 있음)
  if (!email || !password || !nickname || !sido || !sgg || !dong) {
    return { error: "빈칸을 모두 채워 주세요.", fields };
  }
  if (password.length < 6) {
    return { error: "비밀번호는 6자 이상이어야 해요.", fields };
  }
  if (password !== passwordConfirm) {
    return { error: "비밀번호 확인이 일치하지 않아요.", fields };
  }
  if (nickname.length < 2 || nickname.length > 12) {
    return { error: "닉네임은 2~12자로 지어 주세요.", fields };
  }
  if (!isValidRegion(sido, sgg, dong)) {
    return { error: "동네를 시/도 → 시/군/구 → 읍/면/동 순서로 다시 골라 주세요.", fields };
  }
  const neighborhood = `${sido} ${sgg} ${dong}`;
  if (!notCarrot) {
    return { error: "🥕 당근은 가입할 수 없어요. '저는 당근이 아닙니다'에 체크해 주세요.", fields };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // DB 트리거(goguma_handle_new_user)가 이 값으로 goguma_profiles 행을 만든다
      data: { nickname, neighborhood },
      // 인증 메일의 링크를 누르면 돌아올 주소
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) return { error: toKoreanError(error), fields };

  // 이메일 인증이 켜져 있으면 이미 가입된 이메일이어도 에러 없이 identities 가 빈 배열로 온다
  if (data.user && data.user.identities?.length === 0) {
    return { error: "이미 가입된 이메일이에요. 로그인해 주세요.", fields };
  }

  // 이메일 인증이 켜져 있으면 세션 없이 끝난다 → 메일 확인 안내
  if (!data.session) {
    return {
      message: `${email} 로 인증 메일을 보냈어요! 메일의 링크를 누르면 가입이 완료돼요. 🍠📬`,
    };
  }

  // 이메일 인증이 꺼져 있으면 바로 로그인된 상태
  redirect("/?welcome=1");
}

// 로그인
export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = text(formData, "email");
  const password = String(formData.get("password") ?? "");
  const fields = { email };

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해 주세요.", fields };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: toKoreanError(error), fields };

  redirect("/");
}

// 로그아웃
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
