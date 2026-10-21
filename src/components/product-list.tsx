import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/product-queries";
import { bakeStage, CATEGORY_EMOJI, formatPrice, imageUrl, type Product } from "@/lib/products";
import { shortRegion } from "@/lib/regions";

// 카드 배경을 돌아가며 칠한다
const CARD_BGS = [
  "from-goguma-200 to-goguma-100",
  "from-flesh-300 to-flesh-100",
  "from-goguma-300 to-flesh-200",
  "from-leaf-500/30 to-flesh-100",
  "from-flesh-400 to-flesh-100",
];

// 검색어가 있으면 제목에서 노랗게 칠해 준다
function Highlight({ text, words }: { text: string; words?: string[] }) {
  if (!words?.length) return text;
  const pattern = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(pattern).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-flesh-300 px-0.5 text-goguma-900">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export function ProductCard({ product, index = 0, highlight }: { product: Product; index?: number; highlight?: string[] }) {
  const stage = bakeStage(product.bumped_at);
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block h-full overflow-hidden rounded-3xl border-4 border-goguma-900 bg-white shadow-[5px_5px_0_#3d1638] transition hover:-translate-y-1 hover:rotate-[-1deg]"
    >
      <div
        className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br ${CARD_BGS[index % CARD_BGS.length]} text-6xl`}
      >
        {product.images[0] ? (
          <Image
            src={imageUrl(product.images[0])}
            alt={product.title}
            fill
            sizes="(min-width: 768px) 33vw, 50vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <span className="transition group-hover:scale-110">{CATEGORY_EMOJI[product.category]}</span>
        )}
        <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 font-display text-xs ${stage.className}`}>
          {stage.emoji} {stage.label}
        </span>
        {product.images.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-goguma-900/70 px-2 py-0.5 text-xs text-white">
            📷 {product.images.length}
          </span>
        )}
      </div>
      <div className="space-y-1 p-3 sm:p-4">
        <p className="line-clamp-1 font-display text-base text-goguma-900 sm:text-lg">
          <Highlight text={product.title} words={highlight} />
        </p>
        <p className="line-clamp-1 text-xs text-goguma-400 sm:text-sm">
          📍 {shortRegion(product.seller?.neighborhood ?? "고구마동")} · {product.category}
        </p>
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-lg text-goguma-700 sm:text-xl">{formatPrice(product.price)}</p>
          {product.like_count > 0 && <p className="text-sm text-goguma-400">💜 {product.like_count}</p>}
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products, highlight }: { products: Product[]; highlight?: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} index={i} highlight={highlight} />
        </li>
      ))}
    </ul>
  );
}

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
    <div className="mt-6">
      <ProductGrid products={products} />
    </div>
  );
}

export function ProductListSkeleton() {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <li key={i} className="h-64 animate-pulse rounded-3xl border-4 border-goguma-200 bg-goguma-50" />
      ))}
    </ul>
  );
}
