import { BUCKETS, publicImageUrl } from "@/lib/images";

// 판매글 카테고리 — DB(goguma_products.category)의 check 제약과 같은 목록이어야 한다
export const CATEGORIES = [
  "고구마·농산물",
  "디지털기기",
  "가구·인테리어",
  "생활·주방",
  "의류·잡화",
  "도서·취미",
  "기타",
] as const;

export type Category = (typeof CATEGORIES)[number];

// 사진이 없으니 카테고리별 이모지로 대신 보여 준다
export const CATEGORY_EMOJI: Record<Category, string> = {
  "고구마·농산물": "🍠",
  디지털기기: "📱",
  "가구·인테리어": "🛋️",
  "생활·주방": "🍳",
  "의류·잡화": "👕",
  "도서·취미": "📚",
  기타: "📦",
};

export const TITLE_MAX = 40;
export const DESCRIPTION_MAX = 2000;
export const PRICE_MAX = 100_000_000;

// 판매글 사진 최대 장수 (DB check 제약과 같아야 한다)
export const IMAGE_MAX = 5;

export type Product = {
  id: number;
  seller_id: string;
  title: string;
  category: Category;
  price: number;
  description: string;
  // Storage 안의 파일 경로 "<글쓴이 id>/<파일이름>"
  images: string[];
  created_at: string;
  // 마지막으로 "다시 굽기"(끌어올리기)한 시각. 목록은 이 순서.
  bumped_at: string;
  like_count: number;
  seller: { nickname: string; neighborhood: string; avatar_path: string | null } | null;
};

// 판매글 사진 경로 → 누구나 볼 수 있는 주소
export function imageUrl(path: string) {
  return publicImageUrl(BUCKETS.product, path);
}

export function formatPrice(price: number) {
  return price === 0 ? "나눔 🎁" : `${price.toLocaleString("ko-KR")}원`;
}

// 고구마 굽기 단계 — 올리거나 "다시 굽기"한 지 얼마나 됐는지
export function bakeStage(bumpedAt: string, now = Date.now()) {
  const hours = (now - new Date(bumpedAt).getTime()) / 3_600_000;
  if (hours < 6) return { label: "갓 구운", emoji: "🔥", className: "bg-carrot-500 text-white" };
  if (hours < 72) return { label: "따끈따끈", emoji: "♨️", className: "bg-flesh-400 text-goguma-900" };
  if (hours < 24 * 14) return { label: "미지근", emoji: "🍠", className: "bg-goguma-100 text-goguma-700" };
  return { label: "식은 고구마", emoji: "🧊", className: "bg-sky-100 text-sky-700" };
}

// 다시 굽기(끌어올리기)는 하루에 한 번
export const BUMP_COOLDOWN_HOURS = 24;

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });
}
