"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  CATEGORIES,
  DESCRIPTION_MAX,
  IMAGE_BUCKET,
  IMAGE_MAX,
  PRICE_MAX,
  TITLE_MAX,
  type Category,
} from "@/lib/products";

export type ProductFormState = {
  error?: string;
  // 에러가 나도 입력값이 지워지지 않도록 돌려준다
  fields?: Record<string, string>;
};

type ProductInput = { title: string; category: Category; price: number; description: string; images: string[] };

// ImagePicker 가 만든 경로 모양: "<글쓴이 id>/<랜덤 id>.<확장자>"
const IMAGE_PATH = /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp|gif)$/;

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

// 폼 값을 검사해서 저장할 값이나 에러를 돌려준다
// 서버에서도 꼭 다시 검사한다 (브라우저 검사는 우회할 수 있음)
function parseProductForm(formData: FormData, userId: string): { input: ProductInput } | ProductFormState {
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

  // 사진은 내 폴더에 올린 것만 받는다
  const images = formData.getAll("images").map(String);
  if (images.length > IMAGE_MAX) {
    return { error: `사진은 최대 ${IMAGE_MAX}장까지예요.`, fields };
  }
  if (images.some((path) => !IMAGE_PATH.test(path) || !path.startsWith(`${userId}/`))) {
    return { error: "사진 정보가 이상해요. 사진을 다시 올려 주세요.", fields };
  }

  return { input: { title, category: category as Category, price, description, images } };
}

// 로그인한 Supabase 클라이언트와 내 id. 로그아웃 상태면 null.
async function loggedIn() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims ? { supabase, userId: data.claims.sub } : null;
}

// 판매글 등록 (Create)
export async function createProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const session = await loggedIn();
  if (!session) return { error: "로그인이 풀렸어요. 다시 로그인해 주세요." };
  const { supabase, userId } = session;

  const parsed = parseProductForm(formData, userId);
  if (!("input" in parsed)) return parsed;

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
  const session = await loggedIn();
  if (!session) return { error: "로그인이 풀렸어요. 다시 로그인해 주세요." };
  const { supabase, userId } = session;

  const parsed = parseProductForm(formData, userId);
  if (!("input" in parsed)) return parsed;

  // 빠진 사진을 지우려고 원래 사진 목록을 먼저 읽어 둔다
  const { data: before } = await supabase.from("goguma_products").select("images").eq("id", id).maybeSingle();

  // 남의 글이면 RLS 때문에 바뀐 행이 0개로 돌아온다
  const { data, error } = await supabase.from("goguma_products").update(parsed.input).eq("id", id).select("id");
  if (error) return { error: `저장하다 문제가 생겼어요: ${error.message}` };
  if (data.length === 0) return { error: "내가 쓴 글만 고칠 수 있어요." };

  const removed = (before?.images ?? []).filter((path: string) => !parsed.input.images.includes(path));
  if (removed.length > 0) await supabase.storage.from(IMAGE_BUCKET).remove(removed);

  redirect(`/products/${id}`);
}

// 판매글 삭제 (Delete)
export async function deleteProduct(id: number) {
  const session = await loggedIn();
  if (!session) redirect("/login");
  const { supabase } = session;

  // RLS 때문에 남의 글은 지워지지 않는다. 지운 글의 사진도 함께 지운다.
  const { data } = await supabase.from("goguma_products").delete().eq("id", id).select("images");
  const images = data?.flatMap((row) => row.images as string[]) ?? [];
  if (images.length > 0) await supabase.storage.from(IMAGE_BUCKET).remove(images);

  redirect("/?deleted=1");
}
