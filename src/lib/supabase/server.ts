import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

// 서버(Server Component, Server Action, Route Handler)에서 쓰는 Supabase 클라이언트.
// 로그인 세션은 쿠키에 저장되므로 Next.js 의 cookies() 를 연결해 준다.
export async function createClient() {
  // Supabase 는 토큰 만료 확인에 Date.now() 를 쓴다.
  // cacheComponents 환경에서 미리 렌더링되지 않도록 "요청 시점에만 실행"으로 표시한다.
  await connection();
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component 에서는 쿠키를 쓸 수 없다.
            // 세션 갱신은 proxy.ts 가 매 요청마다 해 주므로 무시해도 된다.
          }
        },
      },
    },
  );
}
