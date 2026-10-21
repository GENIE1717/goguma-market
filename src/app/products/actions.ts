"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, DESCRIPTION_MAX, PRICE_MAX, TITLE_MAX, type Category } from "@/lib/products";

export type ProductFormState = {
  error?: string;
  // 에러가 나도 입력값이 지워지지 않도록 돌려준다
  fields?: Record<string, string>;
};

type ProductInput = { title: string; category: Category; price: number; description: string };

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

// 폼 값을 검사해서 저장할 값이나 에러를 돌려준다
// 서버에서도 꼭 다시 검사한다 (브라우저 검사는 우회할 수 있음)
function parseProductForm(formData: FormData): { input: ProductInput } | ProductFormState {
  const title = text(formData, "title");
  const category = text(formData, "category");
  const priceText = text(formData, "price").replaceAll(",", "");
  const description = text(formData, "description");
  const fields = { title, category, price: priceText, description };

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

  return { input: { title, category: category as Category, price, description } };
}

// 로그인한 Supabase 클라이언트. 로그아웃 상태면 null.
async function loggedInClient() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims ? supabase : null;
}

// 판매글 등록 (Create)
export async function createProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const parsed = parseProductForm(formData);
  if (!("input" in parsed)) return parsed;

  const supabase = await loggedInClient();
  if (!supabase) return { error: "로그인이 풀렸어요. 다시 로그인해 주세요." };

  // seller_id 는 DB 기본값 auth.uid() 로 채워진다
  const { data, error } = await supabase.from("goguma_products").insert(parsed.input).select("id").single();
  if (error) return { error: `저장하다 문제가 생겼어요: ${error.message}` };

  redirect(`/products/${data.id}`);
}

// 판매글 수정 (Update) — id 는 .bind 로 미리 넣어 둔다
export async function updateProduct(
  id: number,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = parseProductForm(formData);
  if (!("input" in parsed)) return parsed;

  const supabase = await loggedInClient();
  if (!supabase) return { error: "로그인이 풀렸어요. 다시 로그인해 주세요." };

  // 남의 글이면 RLS 때문에 바뀐 행이 0개로 돌아온다
  const { data, error } = await supabase.from("goguma_products").update(parsed.input).eq("id", id).select("id");
  if (error) return { error: `저장하다 문제가 생겼어요: ${error.message}` };
  if (data.length === 0) return { error: "내가 쓴 글만 고칠 수 있어요." };

  redirect(`/products/${id}`);
}

// 판매글 삭제 (Delete)
export async function deleteProduct(id: number) {
  const supabase = await loggedInClient();
  if (!supabase) redirect("/login");

  // RLS 때문에 남의 글은 지워지지 않는다
  await supabase.from("goguma_products").delete().eq("id", id);
  redirect("/?deleted=1");
}
