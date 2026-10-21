import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  email: string;
  nickname: string;
  neighborhood: string;
  avatar_path: string | null;
  bio: string;
  // GPS 로 동네를 인증한 시각 (없으면 미인증)
  location_verified_at: string | null;
  // 판매 가능 범위 (0 = 내 동네만)
  sell_range_km: number;
};

// 누구나 볼 수 있는 프로필 + 고구마 온도
export type PublicProfile = Omit<Profile, "email"> & { temperature: number; created_at: string };

const PROFILE_COLUMNS = "nickname, neighborhood, avatar_path, bio, location_verified_at, sell_range_km";

// 현재 로그인한 사용자의 프로필. 로그아웃 상태면 null.
// 쿠키를 읽으므로 반드시 <Suspense> 안의 컴포넌트에서 호출해야 한다. (cacheComponents)
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const { data: profile } = await supabase
    .from("goguma_profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", claims.sub)
    .maybeSingle();

  return {
    id: claims.sub,
    email: claims.email ?? "",
    nickname: profile?.nickname ?? "고구마",
    neighborhood: profile?.neighborhood ?? "고구마동",
    avatar_path: profile?.avatar_path ?? null,
    bio: profile?.bio ?? "",
    location_verified_at: profile?.location_verified_at ?? null,
    sell_range_km: profile?.sell_range_km ?? 0,
  };
}

// 고구마 온도만 (기본 36.5도)
export async function getTemperature(id: string): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("goguma_temperature", { target: id });
  return Number(data ?? 36.5);
}

// 다른 사람(또는 나)의 공개 프로필. 없으면 null.
export async function getPublicProfile(id: string): Promise<PublicProfile | null> {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const supabase = await createClient();
  const [{ data: profile }, { data: temperature }] = await Promise.all([
    supabase.from("goguma_profiles").select(`id, created_at, ${PROFILE_COLUMNS}`).eq("id", id).maybeSingle(),
    supabase.rpc("goguma_temperature", { target: id }),
  ]);
  if (!profile) return null;
  return { ...profile, temperature: Number(temperature ?? 36.5) };
}
