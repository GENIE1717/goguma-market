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

export const TITLE_MAX = 40;
export const DESCRIPTION_MAX = 2000;
export const PRICE_MAX = 100_000_000;
