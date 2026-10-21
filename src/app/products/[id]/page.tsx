import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { startChat } from "@/app/products/actions";
import { Avatar } from "@/components/avatar";
import { MannerTemperatureBadge } from "@/components/manner-temperature";
import { getCurrentProfile, getTemperature } from "@/lib/auth";
import { getProduct, hasLiked } from "@/lib/product-queries";
import { bakeStage, CATEGORY_EMOJI, formatDate, formatPrice, imageUrl } from "@/lib/products";
import { shortRegion } from "@/lib/regions";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "./delete-button";
import { BumpButton, LikeButton } from "./product-actions";

export const metadata: Metadata = { title: "판매글 | 고구마마켓" };

// 내 글에 열린 채팅방 개수
async function countChats(productId: number) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("goguma_chat_rooms")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId);
  return count ?? 0;
}

// 판매글 상세 (Read). 내 글이면 수정·삭제·다시 굽기, 남의 글이면 좋아요·채팅·신고.
async function ProductDetail({ id }: { id: string }) {
  const [product, me] = await Promise.all([getProduct(id), getCurrentProfile()]);
  if (!product) notFound();

  const isMine = me?.id === product.seller_id;
  const [temperature, liked, chatCount] = await Promise.all([
    getTemperature(product.seller_id),
    hasLiked(product.id, me?.id),
    isMine ? countChats(product.id) : Promise.resolve(0),
  ]);
  const stage = bakeStage(product.bumped_at);
  const seller = product.seller ?? { nickname: "익명고구마", neighborhood: "고구마동", avatar_path: null };

  return (
    <article className="rounded-[2rem] border-4 border-goguma-900 bg-white shadow-[8px_8px_0_#3d1638]">
      {product.images.length > 0 ? (
        // 사진이 여러 장이면 옆으로 넘겨 본다
        <div className="flex snap-x snap-mandatory overflow-x-auto rounded-t-[1.75rem] bg-goguma-900">
          {product.images.map((path, i) => (
            <div key={path} className="relative aspect-[4/3] w-full shrink-0 snap-center">
              <Image
                src={imageUrl(path)}
                alt={`${product.title} 사진 ${i + 1}`}
                fill
                sizes="(min-width: 672px) 672px, 100vw"
                className="object-contain"
                priority={i === 0}
              />
              {product.images.length > 1 && (
                <span className="absolute bottom-3 right-3 rounded-full bg-goguma-900/70 px-2.5 py-0.5 text-sm text-white">
                  {i + 1} / {product.images.length} ▶
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex aspect-[16/7] items-center justify-center rounded-t-[1.75rem] bg-gradient-to-br from-goguma-200 to-flesh-100 text-8xl">
          {CATEGORY_EMOJI[product.category]}
        </div>
      )}

      <div className="space-y-6 p-5 sm:p-10">
        {/* 판매자 — 누르면 프로필로 */}
        <Link
          href={`/users/${product.seller_id}`}
          className="flex items-center gap-3 border-b-2 border-goguma-100 pb-5 transition hover:opacity-80"
        >
          <Avatar path={seller.avatar_path} nickname={seller.nickname} size={48} />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate font-display text-lg text-goguma-900">{seller.nickname}</p>
            <p className="truncate text-sm text-goguma-500">📍 {shortRegion(seller.neighborhood)}</p>
          </div>
          <MannerTemperatureBadge value={temperature} />
        </Link>

        {/* 본문 */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 font-display text-xs ${stage.className}`}>
              {stage.emoji} {stage.label}
            </span>
            {isMine && <span className="rounded-full bg-flesh-200 px-2.5 py-0.5 font-display text-xs text-goguma-800">내 글</span>}
          </div>
          <h1 className="font-display text-2xl text-goguma-900 sm:text-4xl">{product.title}</h1>
          <p className="text-sm text-goguma-400">
            <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="underline">
              {product.category}
            </Link>{" "}
            · {formatDate(product.created_at)} · 💜 {product.like_count}
          </p>
        </div>
        <p className="whitespace-pre-wrap leading-relaxed text-goguma-900">{product.description}</p>

        {isMine ? (
          <div className="flex flex-wrap items-start gap-3 border-t-2 border-goguma-100 pt-6">
            <Link
              href={`/products/${product.id}/edit`}
              className="rounded-2xl border-4 border-goguma-900 bg-goguma-600 px-5 py-2.5 font-display text-white shadow-[4px_4px_0_#3d1638] transition hover:-translate-y-0.5 hover:bg-goguma-500"
            >
              ✏️ 수정
            </Link>
            <DeleteButton id={product.id} />
            <BumpButton productId={product.id} />
            <Link
              href="/chats"
              className="rounded-2xl border-4 border-goguma-200 px-5 py-2.5 font-display text-goguma-700 transition hover:border-goguma-500"
            >
              💬 이 글의 채팅 {chatCount}개
            </Link>
          </div>
        ) : (
          <>
            {/* 가격 + 좋아요 + 채팅 — 휴대폰에서는 화면 아래에 붙어 있다 */}
            <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] -mx-5 flex items-center gap-3 border-t-2 border-goguma-100 bg-white/95 px-5 py-3 backdrop-blur sm:-mx-10 sm:px-10 md:bottom-0">
              <LikeButton productId={product.id} liked={liked} count={product.like_count} />
              <p className="min-w-0 flex-1 truncate whitespace-nowrap font-display text-xl text-goguma-700 sm:text-3xl">
                {formatPrice(product.price)}
              </p>
              <form action={startChat.bind(null, product.id)}>
                <button
                  type="submit"
                  className="rounded-2xl border-4 border-goguma-900 bg-goguma-600 px-4 py-3 font-display text-lg text-white shadow-[4px_4px_0_#3d1638] transition hover:-translate-y-0.5 hover:bg-goguma-500 sm:px-6"
                >
                  💬 채팅하기
                </button>
              </form>
            </div>
            <Link
              href={`/users/${product.seller_id}/report?product=${product.id}`}
              className="inline-block text-sm text-goguma-400 underline hover:text-carrot-500"
            >
              🚨 이 판매자 신고하기
            </Link>
          </>
        )}
      </div>
    </article>
  );
}

export default function ProductPage({ params }: PageProps<"/products/[id]">) {
  return (
    <div className="bg-goguma-dots flex flex-1 justify-center px-4 py-6 sm:py-12">
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
