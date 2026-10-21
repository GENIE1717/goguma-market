import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { updateProduct } from "@/app/products/actions";
import { ProductForm } from "@/components/product-form";
import { getCurrentProfile } from "@/lib/auth";
import { getProduct } from "@/lib/product-queries";

export const metadata: Metadata = { title: "판매글 수정 | 고구마마켓" };

// 내 글이 아니면 상세 페이지로 돌려보낸다 (로그인 안 했으면 proxy 가 /login 으로 보냄)
async function EditForm({ id }: { id: string }) {
  const [product, profile] = await Promise.all([getProduct(id), getCurrentProfile()]);
  if (!product) notFound();
  if (profile?.id !== product.seller_id) redirect(`/products/${product.id}`);

  return (
    <>
      <Link href={`/products/${product.id}`} className="inline-block text-goguma-500 hover:underline">
        ← 고치지 않고 돌아가기
      </Link>
      <ProductForm action={updateProduct.bind(null, product.id)} product={product} submitLabel="수정 완료 🍠" />
    </>
  );
}

export default function EditProductPage({ params }: PageProps<"/products/[id]/edit">) {
  return (
    <div className="bg-goguma-dots flex flex-1 justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6 rounded-[2rem] border-4 border-goguma-900 bg-white p-8 shadow-[8px_8px_0_#3d1638] sm:p-10">
        <div>
          <p className="font-display text-flesh-500">EDIT</p>
          <h1 className="font-display text-4xl text-goguma-800">판매글 고치기</h1>
        </div>
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-goguma-50" />}>
          {params.then(({ id }) => (
            <EditForm id={id} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
