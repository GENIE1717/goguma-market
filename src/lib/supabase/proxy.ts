import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 로그인한 사람은 볼 필요 없는 페이지
const GUEST_ONLY_PATHS = ["/login", "/signup"];
// 로그인해야 볼 수 있는 페이지 (글쓰기, 글 수정, 내 정보, 채팅, 신고)
const LOGIN_REQUIRED_PATHS = [
  /^\/sell$/,
  /^\/products\/[^/]+\/edit$/,
  /^\/me(\/.*)?$/,
  /^\/chats(\/.*)?$/,
  /^\/users\/[^/]+\/report$/,
];

// 매 요청마다 실행되어 만료된 로그인 토큰을 새로 고치고 쿠키에 다시 써 준다.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getClaims() 는 토큰 서명을 검증하고, 필요하면 토큰을 갱신한다. (getSession 은 검증 X)
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);

  const { pathname } = request.nextUrl;
  const target =
    isLoggedIn && GUEST_ONLY_PATHS.includes(pathname) ? "/"
    : !isLoggedIn && LOGIN_REQUIRED_PATHS.some((path) => path.test(pathname)) ? "/login"
    : null;

  if (target) {
    const redirect = NextResponse.redirect(new URL(target, request.url));
    // 갱신된 세션 쿠키를 리다이렉트 응답에도 옮겨 준다.
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}
