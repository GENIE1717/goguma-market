import Link from "next/link";
import { getProducts } from "@/lib/product-queries";
import { CATEGORY_EMOJI, formatPrice } from "@/lib/products";

// 카드 배경을 돌아가며 칠한다
const CARD_BGS = [
  "from-goguma-200 to-goguma-100",
  "from-flesh-300 to-flesh-100",
  "from-goguma-300 to-flesh-200",
  "from-leaf-500/30 to-flesh-100",
  "from-flesh-400 to-flesh-100",
];

// 홈 화면의 판매글 목록 (DB를 읽으므로 <Suspense> 안에서 렌더링)
export async function ProductList() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border-4 border-dashed border-goguma-300 bg-white/70 p-10 text-center">
        <p className="text-5xl">🍠💤</p>
        <p className="mt-3 font-display text-xl text-goguma-800">아직 올라온 판매글이 없어요.</p>
        <Link
          href="/sell"
          className="mt-4 inline-block font-display text-goguma-700 underline decoration-flesh-400 decoration-4 underline-offset-4"
        >
          첫 판매글 올리기
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
      {products.map((product, i) => (
        <li key={product.id}>
          <Link
            href={`/products/${product.id}`}
            className="group block overflow-hidden rounded-3xl border-4 border-goguma-900 bg-white shadow-[5px_5px_0_#3d1638] transition hover:-translate-y-1 hover:rotate-[-1deg]"
          >
            <div
              className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${CARD_BGS[i % CARD_BGS.length]} text-6xl transition group-hover:scale-105`}
            >
              {CATEGORY_EMOJI[product.category]}
            </div>
            <div className="space-y-1 p-4">
              <p className="line-clamp-1 font-display text-lg text-goguma-900">{product.title}</p>
              <p className="text-sm text-goguma-400">
                📍 {product.seller?.neighborhood ?? "고구마동"} · {product.category}
              </p>
              <p className="font-display text-xl text-goguma-700">{formatPrice(product.price)}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ProductListSkeleton() {
  return (
    <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <li key={i} className="h-64 animate-pulse rounded-3xl border-4 border-goguma-200 bg-goguma-50" />
      ))}
    </ul>
  );
}
