import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LocationCard } from "./location-card";
import { ProfileForm } from "./profile-form";
import { logout } from "@/app/auth/actions";
import { Avatar } from "@/components/avatar";
import { MannerTemperature } from "@/components/manner-temperature";
import { ProductGrid } from "@/components/product-list";
import { getCurrentProfile, getPublicProfile } from "@/lib/auth";
import { getLikedProducts, getProductsBySeller } from "@/lib/product-queries";

export const metadata: Metadata = { title: "내 정보 | 고구마마켓" };

const card = "rounded-[2rem] border-4 border-goguma-900 bg-white p-5 shadow-[6px_6px_0_#3d1638] sm:p-8";

async function MyPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const [publicProfile, myProducts, liked] = await Promise.all([
    getPublicProfile(profile.id),
    getProductsBySeller(profile.id),
    getLikedProducts(profile.id),
  ]);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          {/* 내 프로필 요약 */}
          <section className={card}>
            <div className="flex items-center gap-4">
              <Avatar path={profile.avatar_path} nickname={profile.nickname} size={72} />
              <div className="min-w-0 flex-1">
                <h1 className="truncate font-display text-3xl text-goguma-900">{profile.nickname}</h1>
                <p className="truncate text-sm text-goguma-500">{profile.email}</p>
              </div>
            </div>
            {profile.bio && <p className="mt-4 whitespace-pre-wrap text-goguma-800">{profile.bio}</p>}
            <div className="mt-4">
              <MannerTemperature value={publicProfile?.temperature ?? 36.5} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <Link
                href={`/users/${profile.id}`}
                className="rounded-full border-2 border-goguma-200 px-3 py-1.5 text-goguma-700 hover:border-goguma-500"
              >
                👀 남들이 보는 내 프로필
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full border-2 border-goguma-200 px-3 py-1.5 text-goguma-700 hover:border-carrot-500 hover:text-carrot-500"
                >
                  로그아웃
                </button>
              </form>
            </div>
          </section>

          {/* GPS 동네 인증 + 판매 범위 */}
          <section className={card}>
            <h2 className="mb-4 font-display text-2xl text-goguma-800">🛰️ 내 동네 · 판매 범위</h2>
            <LocationCard
              neighborhood={profile.neighborhood}
              verifiedAt={profile.location_verified_at}
              rangeKm={profile.sell_range_km}
            />
          </section>
        </div>

        <section className={card}>
          <h2 className="mb-4 font-display text-2xl text-goguma-800">✏️ 내 정보 고치기</h2>
          <ProfileForm profile={profile} />
        </section>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-goguma-800">🧺 내 판매글 ({myProducts.length})</h2>
        {myProducts.length > 0 ? (
          <ProductGrid products={myProducts} />
        ) : (
          <p className="text-goguma-500">
            아직 올린 글이 없어요.{" "}
            <Link href="/sell" className="font-display text-goguma-700 underline">
              판매글 쓰기
            </Link>
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-goguma-800">💜 좋아요한 글 ({liked.length})</h2>
        {liked.length > 0 ? (
          <ProductGrid products={liked} />
        ) : (
          <p className="text-goguma-500">마음에 드는 매물에 💜 를 눌러 보세요.</p>
        )}
      </section>
    </>
  );
}

export default function MePage() {
  return (
    <div className="bg-goguma-dots flex-1 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl space-y-10">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-[2rem] border-4 border-goguma-200 bg-goguma-50" />}>
          <MyPage />
        </Suspense>
      </div>
    </div>
  );
}
