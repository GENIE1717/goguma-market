"use server";

import { refresh } from "next/cache";
import { BUCKETS, isMyImagePath } from "@/lib/images";
import { nearestRegion, regionsWithin } from "@/lib/region-geo";
import { isValidRegion } from "@/lib/regions";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  error?: string;
  message?: string;
  fields?: Record<string, string>;
};

const BIO_MAX = 300;

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function loggedIn() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims ? { supabase, userId: data.claims.sub } : null;
}

// 내 정보 저장: 사진, 닉네임, 동네, 자기소개
export async function updateProfile(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const nickname = text(formData, "nickname");
  const sido = text(formData, "sido");
  const sgg = text(formData, "sgg");
  const dong = text(formData, "dong");
  const bio = text(formData, "bio");
  const avatar = formData.getAll("avatar").map(String);
  const fields = { nickname, sido, sgg, dong, bio };

  if (nickname.length < 2 || nickname.length > 12) {
    return { error: "닉네임은 2~12자로 지어 주세요.", fields };
  }
  if (!isValidRegion(sido, sgg, dong)) {
    return { error: "동네를 시/도 → 시/군/구 → 읍/면/동 순서로 골라 주세요.", fields };
  }
  if (bio.length > BIO_MAX) {
    return { error: `자기소개는 ${BIO_MAX}자 이내로 적어 주세요.`, fields };
  }

  const session = await loggedIn();
  if (!session) return { error: "로그인이 풀렸어요. 다시 로그인해 주세요.", fields };
  const { supabase, userId } = session;

  if (avatar.length > 1 || avatar.some((path) => !isMyImagePath(path, userId))) {
    return { error: "프로필 사진 정보가 이상해요. 다시 올려 주세요.", fields };
  }

  const { data: before } = await supabase
    .from("goguma_profiles")
    .select("avatar_path, neighborhood")
    .eq("id", userId)
    .single();

  const neighborhood = `${sido} ${sgg} ${dong}`;
  const avatarPath = avatar[0] ?? null;
  const { error } = await supabase
    .from("goguma_profiles")
    .update({
      nickname,
      neighborhood,
      bio,
      avatar_path: avatarPath,
      // 동네를 손으로 바꾸면 GPS 인증은 풀린다
      ...(before?.neighborhood !== neighborhood ? { location_verified_at: null } : {}),
    })
    .eq("id", userId);
  if (error) return { error: `저장하다 문제가 생겼어요: ${error.message}`, fields };

  // 바뀐 프로필 사진이면 예전 사진 파일은 지운다
  if (before?.avatar_path && before.avatar_path !== avatarPath) {
    await supabase.storage.from(BUCKETS.avatar).remove([before.avatar_path]);
  }

  refresh();
  return { message: "내 정보를 저장했어요! 🍠" };
}

export type LocationState = { error?: string; message?: string };

// GPS 동네 인증: 브라우저가 알려 준 위치로 가장 가까운 동을 찾아 내 동네로 저장한다.
// 위치(위도·경도) 자체는 저장하지 않는다.
export async function verifyLocation(lat: number, lng: number): Promise<LocationState> {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return { error: "위치를 읽지 못했어요." };

  const found = nearestRegion(lat, lng);
  if (!found) return { error: "국내 동네를 찾지 못했어요. 한국 안에서 다시 시도해 주세요." };

  const session = await loggedIn();
  if (!session) return { error: "로그인이 풀렸어요. 다시 로그인해 주세요." };

  const { error } = await session.supabase
    .from("goguma_profiles")
    .update({ neighborhood: found.name, location_verified_at: new Date().toISOString() })
    .eq("id", session.userId);
  if (error) return { error: `저장하다 문제가 생겼어요: ${error.message}` };

  refresh();
  return { message: `📍 ${found.name} 으로 동네 인증을 했어요!` };
}

// 판매 가능 범위 저장 (0 = 내 동네만, 2·5·10 km)
export async function setSellRange(km: number): Promise<LocationState> {
  if (![0, 2, 5, 10].includes(km)) return { error: "범위를 다시 골라 주세요." };

  const session = await loggedIn();
  if (!session) return { error: "로그인이 풀렸어요. 다시 로그인해 주세요." };

  const { error } = await session.supabase
    .from("goguma_profiles")
    .update({ sell_range_km: km })
    .eq("id", session.userId);
  if (error) return { error: `저장하다 문제가 생겼어요: ${error.message}` };

  refresh();
  return { message: "판매 범위를 저장했어요." };
}

// 범위를 고르기 전에 "어떤 동들이 들어가는지" 미리 보기
export async function previewSellRange(neighborhood: string, km: number): Promise<string[]> {
  if (![0, 2, 5, 10].includes(km)) return [];
  return regionsWithin(neighborhood, km);
}
