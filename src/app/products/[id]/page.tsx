import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCurrentProfile } from "@/lib/auth";
import { getProduct } from "@/lib/product-queries";
import { CATEGORY_EMOJI, formatDate, formatPrice } from "@/lib/products";
import { DeleteButton } from "./delete-button";

export const metadata: Metadata = { title: "판매글 | 고구마마켓" };

// 판매글 상세 (Read). 내 글이면 수정·삭제 버튼이 보인다.
async function ProductDetail({ id }: { id: string }) {
  const [product, profile] = await Promise.all([getProduct(id), getCurrentProfile()]);
  if (!product) notFound();

  const isMine = profile?.id === product.seller_id;

  return (
    <article className="overflow-hidden rounded-[2rem] border-4 border-goguma-900 bg-white shadow-[8px_8px_0_#3d1638]">
      <div className="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-goguma-200 to-flesh-100 text-8xl">
        {CATEGORY_EMOJI[product.category]}
      </div>

      <div className="space-y-6 p-8 sm:p-10">
        {/* 판매자 */}
        <div className="flex items-center gap-3 border-b-2 border-goguma-100 pb-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-goguma-100 text-2xl">🍠</span>
          <div className="leading-tight">
            <p className="font-display text-lg text-goguma-900">{product.seller?.nickname ?? "익명고구마"}</p>
            <p className="text-sm text-goguma-500">📍 {product.seller?.neighborhood ?? "고구마동"}</p>
          </div>
          {isMine && (
            <span className="ml-auto rounded-full bg-flesh-200 px-3 py-1 font-display text-sm text-goguma-800">내 글</span>
          )}
        </div>

        {/* 본문 */}
        <div className="space-y-2">
          <h1 className="font-display text-3xl text-goguma-900 sm:text-4xl">{product.title}</h1>
          <p className="text-sm text-goguma-400">
            {product.category} · {formatDate(product.created_at)}
          </p>
          <p className="font-display text-3xl text-goguma-700">{formatPrice(product.price)}</p>
        </div>
        <p className="whitespace-pre-wrap leading-relaxed text-goguma-900">{product.description}</p>

        {isMine && (
          <div className="flex flex-wrap gap-3 border-t-2 border-goguma-100 pt-6">
            <Link
              href={`/products/${product.id}/edit`}
              className="rounded-2xl border-4 border-goguma-900 bg-goguma-600 px-5 py-2.5 font-display text-white shadow-[4px_4px_0_#3d1638] transition hover:-translate-y-0.5 hover:bg-goguma-500"
            >
              ✏️ 수정
            </Link>
            <DeleteButton id={product.id} />
          </div>
        )}
      </div>
    </article>
  );
}

export default function ProductPage({ params }: PageProps<"/products/[id]">) {
  return (
    <div className="bg-goguma-dots flex flex-1 justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-4">
        <Link href="/" className="inline-block font-display text-goguma-700 hover:underline">
          ← 목록으로
        </Link>
        <Suspense fallback={<div className="h-96 animate-pulse rounded-[2rem] border-4 border-goguma-200 bg-goguma-50" />}>
          {params.then(({ id }) => (
            <ProductDetail id={id} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
