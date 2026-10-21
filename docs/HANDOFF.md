# 🍠 고구마마켓 작업 이어하기 안내서

다른 컴퓨터(또는 새 Claude Code 대화)에서 이 프로젝트를 **바로 이어서** 작업하기 위한 정리입니다.
Claude 는 작업을 시작하기 전에 이 문서와 `CLAUDE.md` 를 먼저 읽습니다.

마지막 정리: 2026-10-21 (커밋 `5c5dc8e` 까지 반영)

---

## 1. 주소 모음

| 무엇 | 주소 |
| --- | --- |
| 실제 사이트 (Vercel) | https://goguma-market-opal.vercel.app |
| 코드 보관 (GitHub, 공개 저장소) | https://github.com/GENIE1717/goguma-market |
| 데이터 창고 (Supabase 프로젝트) | 프로젝트 ref `pwbargvbyizyzfodcvqe` — https://supabase.com/dashboard/project/pwbargvbyizyzfodcvqe |

- 코드는 GitHub 에, 데이터(회원·판매글·사진·채팅)는 Supabase 에 있습니다. **컴퓨터를 바꿔도 데이터는 그대로**입니다.
- GitHub `main` 에 올리면(push) Vercel 이 자동으로 실제 사이트에 반영합니다.

---

## 2. 새 컴퓨터에서 처음 한 번 준비하기

1. **Node.js 설치** — https://nodejs.org 에서 LTS 버전을 받아 설치합니다.
2. **Git 설치** — https://git-scm.com 에서 받아 설치합니다.
3. **코드 받기** — 원하는 폴더에서:
   ```bash
   git clone https://github.com/GENIE1717/goguma-market.git Goguma
   ```
4. **부품 설치** — `Goguma` 폴더 안에서:
   ```bash
   npm install
   ```
5. **`.env.local` 만들기** (비밀 정보라 GitHub 에 없음)
   1. `.env.example` 을 복사해서 이름을 `.env.local` 로 바꿉니다.
   2. Supabase 대시보드 → 위 프로젝트 → **Project Settings → API Keys / Data API** 에서
      - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
      - `Publishable key` (sb_publishable_…) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   3. `NEXT_PUBLIC_SITE_URL=http://localhost:3000` 은 그대로 둡니다.
   - Vercel 대시보드 → goguma-market → Settings → Environment Variables 에도 같은 값이 있습니다.
6. **Claude Code 에서 `Goguma` 폴더 열기** — 첫 메시지로 "docs/HANDOFF.md 읽고 이어서 작업하자" 라고 하면 됩니다.
7. **개발 서버 설정 확인** — `.claude/launch.json` 의 `goguma-dev` 는 원래 컴퓨터의 휴대용 Node 경로
   (`C:\Users\student\AppData\Local\node-portable\...`)를 쓰고 있습니다.
   새 컴퓨터에서는 Claude 가 `"runtimeExecutable": "npm"`, `"runtimeArgs": ["run", "dev"]` 로 바꿔서 쓰면 됩니다.
8. **GitHub 로그인** — 처음 push 할 때 브라우저(크롬)에서 GitHub 로그인 → **Authorize** 를 눌러야 합니다.
9. **Supabase 연결(MCP)** — Claude Code 에서 Supabase 도구를 쓰려면 새 컴퓨터에서도 Supabase 커넥터를 연결해야 합니다.

---

## 3. 지금까지 만든 것 (단계별)

| 단계 | 커밋 | 내용 |
| --- | --- | --- |
| 1 | `674d20c` | 회원가입·로그인·로그아웃, 고구마 테마 디자인 |
| 2 | `19856e5` | 판매글 쓰기 |
| 3 | `e8fcd80` | 판매글 목록·상세·수정·삭제 (CRUD) |
| 4 | `a36912b` | 홈 정리(배경에 작은 고구마 vs 당근 싸움), 회원가입 지역 필터(시/도→시/군/구→읍/면/동), 판매글 사진 |
| 5 | `5c5dc8e` | 내 정보·이웃 프로필, 고구마 온도, 좋아요, 비매너 신고, GPS 동네 인증·판매 범위, 1:1 실시간 채팅, 검색·분류 추천, 고구마 굽기 단계·다시 굽기, 모바일 자동 대응 |

### 화면(주소)별 위치

| 주소 | 화면 | 주요 파일 |
| --- | --- | --- |
| `/` | 홈 (판매글 목록, 분류 버튼, 배경 싸움 장면) | `src/app/page.tsx`, `src/components/product-list.tsx`, `src/components/decorations.tsx` |
| `/login`, `/signup` | 로그인·회원가입 | `src/app/(auth)/`, `src/app/auth/actions.ts` |
| `/sell` | 판매글 쓰기 | `src/app/sell/page.tsx`, `src/components/product-form.tsx` |
| `/products/[id]` | 판매글 상세 (좋아요·채팅·신고 / 내 글이면 수정·삭제·다시 굽기) | `src/app/products/[id]/` |
| `/products/[id]/edit` | 판매글 수정 | `src/app/products/[id]/edit/page.tsx` |
| `/search` | 검색 + 분류 추천 + 비슷한 분류 매물 | `src/app/search/page.tsx`, `src/lib/search.ts` |
| `/me` | 내 정보 (프로필 수정, GPS 인증, 판매 범위, 내 글, 좋아요한 글, 로그아웃) | `src/app/me/` |
| `/users/[id]` | 이웃 프로필 (고구마 온도, 판매글) | `src/app/users/[id]/page.tsx` |
| `/users/[id]/report` | 비매너 신고 (사유, 내용, 증거 사진) | `src/app/users/[id]/report/` |
| `/chats`, `/chats/[id]` | 채팅 목록·채팅방 (실시간) | `src/app/chats/` |

- 로그인이 필요한 주소는 `src/lib/supabase/proxy.ts` 의 `LOGIN_REQUIRED_PATHS` 에 모여 있습니다.
- PC 는 위쪽 메뉴(`src/components/header.tsx`), 휴대폰(768px 미만)은 아래쪽 탭(`src/components/bottom-nav.tsx`). 기능은 같습니다.

---

## 4. 데이터 창고(Supabase) 구조

모든 이름 앞에 `goguma_` — 같은 DB 에 가계부 앱(entries, settings, weather) 표가 함께 있어서 구분합니다.
변경 기록은 `supabase/migrations/` 에 순서대로 있습니다. (이미 Supabase 에 적용됨 — 새 컴퓨터에서 다시 실행할 필요 없음)

| 표 / 함수 / 버킷 | 역할 | 규칙(RLS) 요약 |
| --- | --- | --- |
| `goguma_profiles` | 닉네임, 동네(“시도 시군구 읍면동” 전체), 사진, 자기소개, GPS 인증 시각, 판매 범위 | 누구나 조회, 본인만 수정. 가입 시 트리거로 자동 생성 |
| `goguma_products` | 판매글 (사진 경로 최대 5개, `bumped_at` = 다시 굽기 시각) | 누구나 조회, 본인만 작성·수정·삭제 |
| `goguma_likes` | 좋아요 | 누구나 조회, 본인만 누르기·취소, **내 글에는 금지** |
| `goguma_reports` | 비매너 신고 (사유, 내용, 증거 사진) | **신고한 본인만** 조회 |
| `goguma_chat_rooms` / `goguma_chat_messages` | 채팅방(판매글×구매자 1개) / 메시지 | 참여자만 조회·전송. 메시지는 Realtime 등록됨 |
| `goguma_temperature(id)` | 고구마 온도 계산 (숫자만 돌려줌) | security definer |
| `goguma_my_chat_rooms()` | 내 채팅방 목록 + 안 읽은 개수 | security invoker |
| `goguma_mark_chat_read(room)` | 채팅방 읽음 표시 | 내 쪽 읽음 시각만 바꿈 |
| 버킷 `goguma-product-images` | 판매글 사진 (공개) | 내 폴더(`<내 id>/`)에만 올리기·지우기 |
| 버킷 `goguma-avatars` | 프로필 사진 (공개) | 〃 |
| 버킷 `goguma-report-evidence` | 신고 증거 사진 (**비공개**) | 〃, 본인만 조회 |

---

## 5. 정해 둔 규칙과 결정

- **고구마 온도**: 기본 36.5℃ · 내 글이 받은 좋아요 1개당 +0.1℃ · 나를 신고한 사람 1명당 -1℃ · 0~99.9℃.
  아이콘 단계: 🧊 <20 · 🍠 <36.5 · ♨️ <45 · 🔥 <60 · 🌋 60 이상 (`src/components/manner-temperature.tsx`)
- **고구마 굽기 단계**(제가 제안한 새 기능): 🔥 갓 구운(6시간) · ♨️ 따끈따끈(3일) · 🍠 미지근(14일) · 🧊 식은 고구마.
  **다시 굽기**(끌어올리기)는 하루 1번 (`BUMP_COOLDOWN_HOURS = 24`).
- **사진**: 판매글 최대 5장, 한 장 5MB, jpg/png/webp/gif. 브라우저에서 Storage 로 바로 올리고 폼에는 경로만 보냄.
  수정에서 뺀 사진·삭제한 글의 사진은 Storage 에서도 지움.
- **동네 데이터**: 행정동 기준 (통계청 SGIS · vuski/admdongkor ver20261001, **CC BY 4.0 — 출처 표시 필요**, 회원가입 화면에 표시함).
  `src/data/regions.json`(이름), `src/data/region-coords.json`(동 중심 좌표, 서버에서만 사용).
  다시 만드는 스크립트는 남겨 두지 않았음 — 필요하면 원본 GeoJSON 에서 이름·중심점만 뽑으면 됨.
- **GPS**: 위도·경도는 저장하지 않고, 가장 가까운 동 이름과 인증 시각만 저장. 판매 범위는 0(내 동네만)/2/5/10km.
- **검색**: 제목·설명에 모든 단어가 들어간 글. 검색어 → 분류 추천 사전은 `src/lib/search.ts` 의 `DICTIONARY`.
- **샘플 판매글 3개**(해남 꿀고구마, 접이식 자전거, 원목 의자)는 사용자 계정으로 올렸고 사진은 Unsplash 무료 사진.

---

## 6. 아직 안 된 것 / 다음 후보

- [ ] 판매 범위로 매물 거르기 (지금은 범위를 저장만 함)
- [ ] 신고를 확인·처리하는 관리자 화면
- [ ] 사용자 계정 동네가 옛 형식(“중구 수표동”) — 내 정보에서 GPS 인증 또는 다시 선택 필요
- [ ] 로그인 후 원래 보던 페이지로 돌아가기
- [ ] 거래 상태(판매중 / 예약중 / 판매완료)
- [ ] Vercel 주소를 `goguma-market.vercel.app` 으로 바꾸기 — Vercel 대시보드에서 사용자가 직접 (Settings → Domains → Add)

---

## 7. 작업하다 알게 된 주의점 (Claude 용 메모)

- **Next.js 16 + cacheComponents**: 쿠키·params·`usePathname()` 을 읽는 컴포넌트는 반드시 `<Suspense>` 안에.
  Suspense 의 `fallback` 안에서도 `usePathname()` 쓰면 안 됨 (`BottomNavLinks` 를 fallback 으로 쓰는 이유).
- **Supabase 조인 이름 충돌**: `goguma_likes` 가 생긴 뒤로 판매글→프로필 조인은
  `goguma_profiles!goguma_products_seller_id_fkey(...)` 처럼 연결 이름을 꼭 적어야 함.
- **실시간 채팅**: 구독 전에 `supabase.realtime.setAuth(access_token)` 을 해야 RLS 를 통과해서 메시지를 받음.
- **개발 서버가 옛 코드를 붙잡을 때**(서버·브라우저 내용이 다르다는 hydration 오류): 개발 서버를 껐다 켜면 해결.
- **두 번째 로그인 창 테스트**: `http://127.0.0.1:3000` 으로 열면 쿠키가 따로라서 다른 계정으로 동시에 테스트 가능
  (`next.config.ts` 의 `allowedDevOrigins` 에 등록해 둠).
- **테스트 계정 정리**: `auth.users` 에서 지우면 프로필·글·좋아요·신고·채팅이 함께 지워짐.
  단 Storage 파일은 SQL 로 못 지우므로(`protect_delete`) 앱 기능이나 Storage API 로 먼저 지울 것.
- **빌드 확인**: `npm run build` 가 통과해야 Vercel 배포도 성공함. 타입 검사 `npx tsc --noEmit`, 코드 검사 `npx eslint src`.
