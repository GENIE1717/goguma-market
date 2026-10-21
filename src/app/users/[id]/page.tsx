import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Avatar } from "@/components/avatar";
import { MannerTemperature } from "@/components/manner-temperature";
import { ProductGrid } from "@/components/product-list";
import { getCurrentProfile, getPublicProfile } from "@/lib/auth";
import { getProductsBySeller } from "@/lib/product-queries";
import { shortRegion } from "@/lib/regions";

export const metadata: Metadata = { title: "이웃 프로필 | 고구마마켓" };

// 다른 이웃의 프로필: 사진, 닉네임, 동네, 고구마 온도, 자기소개, 판매글
async function UserProfile({ id }: { id: string }) {
  const [user, me] = await Promise.all([getPublicProfile(id), getCurrentProfile()]);
  if (!user) notFound();
  const products = await getProductsBySeller(user.id);
  const isMe = me?.id === user.id;

  return (
    <>
      <section className="rounded-[2rem] border-4 border-goguma-900 bg-white p-5 shadow-[6px_6px_0_#3d1638] sm:p-8">
        <div className="flex items-center gap-4">
          <Avatar path={user.avatar_path} nickname={user.nickname} size={80} />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-3xl text-goguma-900">{user.nickname}</h1>
            <p className="text-sm text-goguma-500">
              📍 {shortRegion(user.neighborhood)}
              {user.location_verified_at && <span className="ml-1 text-leaf-500">✔ 동네 인증</span>}
            </p>
            <p className="text-xs text-goguma-400">
              {new Date(user.created_at).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })} 가입
            </p>
          </div>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-goguma-800">{user.bio || "아직 자기소개가 없어요. 🍠"}</p>

        <div className="mt-4">
          <MannerTemperature value={user.temperature} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {isMe ? (
            <Link href="/me" className="rounded-full border-2 border-goguma-200 px-3 py-1.5 text-goguma-700 hover:border-goguma-500">
              ✏️ 내 정보 고치기
            </Link>
          ) : (
            <Link
              href={`/users/${user.id}/report`}
              className="rounded-full border-2 border-goguma-200 px-3 py-1.5 text-goguma-500 hover:border-carrot-500 hover:text-carrot-500"
            >
              🚨 비매너 신고
            </Link>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-goguma-800">🧺 {user.nickname}님의 판매글 ({products.length})</h2>
        {products.length > 0 ? <ProductGrid products={products} /> : <p className="text-goguma-500">아직 올린 글이 없어요.</p>}
      </section>
    </>
  );
}

export default function UserPage({ params }: PageProps<"/users/[id]">) {
  return (
    <div className="bg-goguma-dots flex-1 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <Suspense fallback={<div className="h-80 animate-pulse rounded-[2rem] border-4 border-goguma-200 bg-goguma-50" />}>
          {params.then(({ id }) => (
            <UserProfile id={id} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
