import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/products";

// 판매자 닉네임·동네도 함께 가져온다 (seller_id → goguma_profiles.id)
const PRODUCT_COLUMNS =
  "id, seller_id, title, category, price, description, created_at, seller:goguma_profiles(nickname, neighborhood)";

// 최신 판매글 목록
export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("goguma_products")
    .select(PRODUCT_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(60)
    .returns<Product[]>();
  return data ?? [];
}

// 판매글 하나. 없거나 id 가 숫자가 아니면 null.
export async function getProduct(id: string): Promise<Product | null> {
  if (!/^\d+$/.test(id)) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("goguma_products")
    .select(PRODUCT_COLUMNS)
    .eq("id", Number(id))
    .returns<Product[]>()
    .maybeSingle();
  return data;
}
