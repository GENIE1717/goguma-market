import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { ReportForm } from "./report-form";
import { Avatar } from "@/components/avatar";
import { getCurrentProfile, getPublicProfile } from "@/lib/auth";

export const metadata: Metadata = { title: "비매너 신고 | 고구마마켓" };

// ?product=판매글번호 로 들어오면 어떤 글에서 신고했는지도 함께 남긴다
async function Report({ id, product }: { id: string; product?: string }) {
  const [user, me] = await Promise.all([getPublicProfile(id), getCurrentProfile()]);
  if (!user) notFound();
  if (me?.id === user.id) redirect("/me");
  const productId = product && /^\d+$/.test(product) ? Number(product) : null;

  return (
    <>
      <Link href={`/users/${user.id}`} className="flex items-center gap-3 rounded-2xl bg-goguma-50 p-3">
        <Avatar path={user.avatar_path} nickname={user.nickname} size={44} />
        <span>
          <span className="block font-display text-goguma-900">{user.nickname}님을 신고해요</span>
          <span className="block text-xs text-goguma-500">신고가 접수되면 상대의 고구마 온도가 내려가요. 사실만 적어 주세요 🙏</span>
        </span>
      </Link>
      <ReportForm reportedId={user.id} productId={productId} />
    </>
  );
}

export default function ReportPage({ params, searchParams }: PageProps<"/users/[id]/report">) {
  return (
    <div className="bg-goguma-dots flex flex-1 justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl space-y-6 rounded-[2rem] border-4 border-goguma-900 bg-white p-6 shadow-[8px_8px_0_#3d1638] sm:p-10">
        <div>
          <p className="font-display text-carrot-500">REPORT</p>
          <h1 className="font-display text-4xl text-goguma-800">비매너 이웃 신고</h1>
        </div>
        <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-goguma-50" />}>
          {Promise.all([params, searchParams]).then(([{ id }, { product }]) => (
            <Report id={id} product={typeof product === "string" ? product : undefined} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
