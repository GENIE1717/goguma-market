# 🍠 고구마마켓

당근마켓을 따라 만드는 공부용 동네 중고거래 사이트 (Next.js 16 + Supabase)

## 실행

```bash
npm install
npm run dev
```

`.env.local` 이 필요합니다. 형식은 `.env.example` 참고.

## 진행 단계

- [x] 1단계: 회원가입 / 로그인 / 로그아웃 (Supabase Auth + `goguma_profiles` 테이블)
- [ ] 2단계: 상품 등록 · 목록 · 상세
- [ ] 3단계: 이미지 업로드 (Supabase Storage)
- [ ] 4단계: 관심(좋아요) · 채팅

## 폴더 구조

| 경로 | 역할 |
| --- | --- |
| `src/proxy.ts` | 매 요청마다 로그인 토큰 갱신 (Next 16 에서 middleware → proxy 로 이름 변경) |
| `src/lib/supabase/` | 브라우저용 / 서버용 / proxy용 Supabase 클라이언트 |
| `src/lib/auth.ts` | 현재 로그인한 사용자의 프로필 가져오기 |
| `src/app/auth/actions.ts` | 회원가입 · 로그인 · 로그아웃 Server Action |
| `src/app/auth/callback/route.ts` | 인증 메일 링크를 눌렀을 때 세션으로 교환 |
| `src/app/(auth)/` | 로그인 · 회원가입 화면 |
| `src/components/` | 고구마 · 당근 캐릭터, 배틀, 헤더 등 UI |
| `supabase/migrations/` | DB 변경 기록 (가계부와 같은 DB 라서 `goguma_` 접두사 사용) |

## 배포 (Vercel)

배포 주소: https://goguma-market-opal.vercel.app

```bash
vercel deploy --prod
```

- 환경 변수 3개(`.env.example` 참고)는 Vercel 프로젝트에 등록돼 있다. `NEXT_PUBLIC_SITE_URL` 은 위 배포 주소.
- `vercel.json` 에 `"framework": "nextjs"` 를 적어 둬야 한다 (없으면 "Other"로 잡혀 404).
- 이메일 인증을 켜면 Supabase 대시보드 → Authentication → URL Configuration → Redirect URLs 에 `https://goguma-market-opal.vercel.app/**` 추가
