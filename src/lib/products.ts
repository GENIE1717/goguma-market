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

export type Product = {
  id: number;
  seller_id: string;
  title: string;
  category: Category;
  price: number;
  description: string;
  created_at: string;
  seller: { nickname: string; neighborhood: string } | null;
};

export function formatPrice(price: number) {
  return price === 0 ? "나눔 🎁" : `${price.toLocaleString("ko-KR")}원`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });
}
