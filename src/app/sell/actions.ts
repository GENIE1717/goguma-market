"use server";

import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, DESCRIPTION_MAX, PRICE_MAX, TITLE_MAX, type Category } from "@/lib/products";

export type SellState = {
  error?: string;
  // 등록에 성공하면 채워진다
  done?: { title: string; price: number };
  // 에러가 나도 입력값이 지워지지 않도록 돌려준다
  fields?: Record<string, string>;
};

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

// 판매글 등록
export async function createProduct(_prev: SellState, formData: FormData): Promise<SellState> {
  const title = text(formData, "title");
  const category = text(formData, "category");
  const priceText = text(formData, "price").replaceAll(",", "");
  const description = text(formData, "description");
  const fields = { title, category, price: priceText, description };

  // 서버에서도 꼭 다시 검사한다 (브라우저 검사는 우회할 수 있음)
  if (!title || !category || !priceText || !description) {
    return { error: "빈칸을 모두 채워 주세요.", fields };
  }
  if (title.length < 2 || title.length > TITLE_MAX) {
    return { error: `제목은 2~${TITLE_MAX}자로 적어 주세요.`, fields };
  }
  if (!CATEGORIES.includes(category as Category)) {
    return { error: "카테고리를 골라 주세요.", fields };
  }
  const price = Number(priceText);
  if (!Number.isInteger(price) || price < 0 || price > PRICE_MAX) {
    return { error: "가격은 0원 ~ 1억 원 사이의 숫자로 적어 주세요.", fields };
  }
  if (description.length < 10 || description.length > DESCRIPTION_MAX) {
    return { error: `설명은 10~${DESCRIPTION_MAX}자로 적어 주세요.`, fields };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: "로그인이 풀렸어요. 다시 로그인해 주세요.", fields };
  }

  // seller_id 는 DB 기본값 auth.uid() 로 채워진다
  const { error } = await supabase.from("goguma_products").insert({ title, category, price, description });
  if (error) {
    return { error: `저장하다 문제가 생겼어요: ${error.message}`, fields };
  }

  return { done: { title, price } };
}
