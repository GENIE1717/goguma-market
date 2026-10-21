import { createClient } from "@/lib/supabase/server";
import { PRODUCT_COLUMNS, toProduct, type ProductRow } from "@/lib/product-queries";
import { CATEGORIES, type Category, type Product } from "@/lib/products";

// 검색어 → 어울리는 분류 (자동 추천용 사전)
const KEYWORD_CATEGORY: Record<string, Category> = {};
const DICTIONARY: Record<Category, string[]> = {
  "고구마·농산물": ["고구마", "감자", "호박", "사과", "배", "귤", "쌀", "김치", "채소", "과일", "농산물", "말랭이", "꿀", "옥수수", "밤"],
  디지털기기: ["폰", "아이폰", "갤럭시", "핸드폰", "휴대폰", "노트북", "맥북", "아이패드", "태블릿", "컴퓨터", "모니터", "키보드", "마우스", "이어폰", "에어팟", "카메라", "닌텐도", "플스", "충전기"],
  "가구·인테리어": ["의자", "책상", "소파", "침대", "식탁", "옷장", "선반", "조명", "스탠드", "커튼", "러그", "매트리스", "서랍", "거울", "화분"],
  "생활·주방": ["냄비", "프라이팬", "그릇", "컵", "에어프라이어", "전자레인지", "밥솥", "청소기", "선풍기", "가습기", "히터", "세제", "수건", "군고구마 기계"],
  "의류·잡화": ["옷", "패딩", "코트", "자켓", "바지", "치마", "원피스", "신발", "운동화", "가방", "지갑", "모자", "시계", "목도리"],
  "도서·취미": ["책", "만화", "소설", "문제집", "자전거", "캠핑", "텐트", "낚시", "골프", "기타", "피아노", "보드게임", "레고", "퍼즐", "운동", "덤벨", "요가"],
  기타: ["나눔", "무료", "티켓", "상품권", "쿠폰"],
};
for (const [category, words] of Object.entries(DICTIONARY) as [Category, string[]][]) {
  for (const word of words) KEYWORD_CATEGORY[word] = category;
}

export const POPULAR_KEYWORDS = ["고구마", "자전거", "의자", "아이폰", "패딩", "책상", "캠핑", "에어프라이어"];

// 검색어를 단어로 나눈다. PostgREST 필터 문법을 깨는 글자(, ( ) % * \)는 뺀다.
export function splitWords(q: string) {
  return q
    .replace(/[,()%*\\]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .slice(0, 5);
}

// 검색어로 짐작한 분류 (사전에 있는 단어가 검색어에 들어 있거나, 검색어가 사전 단어의 일부일 때)
export function guessCategories(words: string[]): Category[] {
  const found = new Set<Category>();
  for (const word of words) {
    for (const [keyword, category] of Object.entries(KEYWORD_CATEGORY)) {
      if (word.includes(keyword) || (word.length >= 2 && keyword.includes(word))) found.add(category);
    }
    // 분류 이름 자체를 검색했을 때 (예: "가구", "디지털")
    for (const category of CATEGORIES) {
      if (word.length >= 2 && category.includes(word)) found.add(category);
    }
  }
  return [...found];
}

// 모든 단어가 제목이나 설명에 들어 있는 판매글 (+ 분류로 거르기)
export async function searchProducts(words: string[], category?: Category): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from("goguma_products").select(PRODUCT_COLUMNS);
  for (const word of words) query = query.or(`title.ilike.%${word}%,description.ilike.%${word}%`);
  if (category) query = query.eq("category", category);
  const { data } = await query.order("bumped_at", { ascending: false }).limit(60).returns<ProductRow[]>();
  return (data ?? []).map(toProduct);
}

// 비슷한 분류의 다른 판매글 (이미 보여 준 글은 빼고)
export async function relatedProducts(categories: Category[], excludeIds: number[]): Promise<Product[]> {
  if (categories.length === 0) return [];
  const supabase = await createClient();
  let query = supabase.from("goguma_products").select(PRODUCT_COLUMNS).in("category", categories);
  if (excludeIds.length > 0) query = query.not("id", "in", `(${excludeIds.join(",")})`);
  const { data } = await query.order("bumped_at", { ascending: false }).limit(6).returns<ProductRow[]>();
  return (data ?? []).map(toProduct);
}
