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

// 사진 — Supabase Storage 버킷 설정(migrations)과 같아야 한다
export const IMAGE_BUCKET = "goguma-product-images";
export const IMAGE_MAX = 5;
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

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
  seller: { nickname: string; neighborhood: string } | null;
};

// 사진 경로 → 누구나 볼 수 있는 주소
export function imageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`;
}

export function formatPrice(price: number) {
  return price === 0 ? "나눔 🎁" : `${price.toLocaleString("ko-KR")}원`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });
}
