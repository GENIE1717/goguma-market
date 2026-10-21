import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/products";

// 판매자 닉네임·동네·사진과 좋아요 개수도 함께 가져온다
export const PRODUCT_COLUMNS =
  "id, seller_id, title, category, price, description, images, created_at, bumped_at, " +
  "seller:goguma_profiles!goguma_products_seller_id_fkey(nickname, neighborhood, avatar_path), likes:goguma_likes(count)";

export type ProductRow = Omit<Product, "like_count"> & { likes: { count: number }[] };

export function toProduct({ likes, ...row }: ProductRow): Product {
  return { ...row, like_count: likes[0]?.count ?? 0 };
}

// 조건을 더 붙일 수 있는 판매글 조회 (await 하면 바로 실행되므로 async 로 감싸지 않는다)
function productsQuery(supabase: Awaited<ReturnType<typeof createClient>>) {
  return supabase.from("goguma_products").select(PRODUCT_COLUMNS);
}

// 최신(다시 구운) 순 판매글 목록
export async function getProducts(): Promise<Product[]> {
  const { data } = await productsQuery(await createClient())
    .order("bumped_at", { ascending: false })
    .limit(60)
    .returns<ProductRow[]>();
  return (data ?? []).map(toProduct);
}

// 한 사람의 판매글
export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  const { data } = await productsQuery(await createClient())
    .eq("seller_id", sellerId)
    .order("bumped_at", { ascending: false })
    .returns<ProductRow[]>();
  return (data ?? []).map(toProduct);
}

// 내가 좋아요한 판매글
export async function getLikedProducts(userId: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data: likes } = await supabase
    .from("goguma_likes")
    .select("product_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  const ids = (likes ?? []).map((l) => l.product_id);
  if (ids.length === 0) return [];
  const { data } = await productsQuery(supabase).in("id", ids).returns<ProductRow[]>();
  const byId = new Map((data ?? []).map((row) => [row.id, toProduct(row)]));
  return ids.flatMap((id) => byId.get(id) ?? []);
}

// 판매글 하나. 없거나 id 가 숫자가 아니면 null.
export async function getProduct(id: string): Promise<Product | null> {
  if (!/^\d+$/.test(id)) return null;
  const { data } = await productsQuery(await createClient()).eq("id", Number(id)).returns<ProductRow[]>().maybeSingle();
  return data ? toProduct(data) : null;
}

// 내가 이 글에 좋아요를 눌렀는지
export async function hasLiked(productId: number, userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  const supabase = await createClient();
  const { count } = await supabase
    .from("goguma_likes")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId)
    .eq("user_id", userId);
  return (count ?? 0) > 0;
}
