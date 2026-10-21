import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  email: string;
  nickname: string;
  neighborhood: string;
};

// 현재 로그인한 사용자의 프로필. 로그아웃 상태면 null.
// 쿠키를 읽으므로 반드시 <Suspense> 안의 컴포넌트에서 호출해야 한다. (cacheComponents)
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const { data: profile } = await supabase
    .from("goguma_profiles")
    .select("nickname, neighborhood")
    .eq("id", claims.sub)
    .maybeSingle();

  return {
    id: claims.sub,
    email: claims.email ?? "",
    nickname: profile?.nickname ?? "고구마",
    neighborhood: profile?.neighborhood ?? "고구마동",
  };
}
