import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CategoryChips } from "@/components/category-chips";
import { ProductGrid } from "@/components/product-list";
import { CATEGORIES, CATEGORY_EMOJI, type Category } from "@/lib/products";
import { getProducts } from "@/lib/product-queries";
import { guessCategories, POPULAR_KEYWORDS, relatedProducts, searchProducts, splitWords } from "@/lib/search";

export const metadata: Metadata = { title: "검색 | 고구마마켓" };

type SearchQuery = { q?: string; category?: string };

async function Results({ q, category }: { q: string; category?: Category }) {
  const words = splitWords(q);

  // 검색어도 분류도 없으면: 인기 검색어 + 최근 매물
  if (words.length === 0 && !category) {
    const latest = await getProducts();
    return (
      <>
        <section className="space-y-2">
          <h2 className="font-display text-lg text-goguma-800">🔥 이런 걸 많이 찾아요</h2>
          <div className="flex flex-wrap gap-2">
            {POPULAR_KEYWORDS.map((k) => (
              <Link
                key={k}
                href={`/search?q=${encodeURIComponent(k)}`}
                className="rounded-full bg-flesh-200 px-3 py-1.5 text-sm text-goguma-800 hover:bg-flesh-300"
              >
                #{k}
              </Link>
            ))}
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-goguma-800">🍠 방금 올라온 매물</h2>
          <ProductGrid products={latest.slice(0, 12)} />
        </section>
      </>
    );
  }

  const results = await searchProducts(words, category);
  // 분류 추천: 검색어로 짐작한 분류 + 결과에 많이 나온 분류
  const fromResults = Object.entries(
    results.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.category]: (acc[p.category] ?? 0) + 1 }), {}),
  )
    .sort((a, b) => b[1] - a[1])
    .map(([c]) => c as Category);
  const suggested = [...new Set([...guessCategories(words), ...fromResults])].filter((c) => c !== category);
  const related = await relatedProducts(
    category ? [category, ...suggested].slice(0, 3) : suggested.slice(0, 3),
    results.map((p) => p.id),
  );

  return (
    <>
      <p className="text-goguma-600">
        {words.length > 0 && (
          <>
            <b className="font-display text-goguma-900">&lsquo;{words.join(" ")}&rsquo;</b>
            {category && " · "}
          </>
        )}
        {category && <b className="font-display text-goguma-900">{category}</b>} 매물 {results.length}개
      </p>

      {suggested.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-display text-lg text-goguma-800">📂 이런 분류는 어때요?</h2>
          <div className="flex flex-wrap gap-2">
            {suggested.map((c) => (
              <Link
                key={c}
                href={`/search?category=${encodeURIComponent(c)}`}
                className="rounded-full border-2 border-goguma-300 bg-white px-3 py-1.5 text-sm text-goguma-700 hover:border-goguma-600"
              >
                {CATEGORY_EMOJI[c]} {c}
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.length > 0 ? (
        <ProductGrid products={results} highlight={words} />
      ) : (
        <div className="rounded-3xl border-4 border-dashed border-goguma-300 bg-white/70 p-8 text-center">
          <p className="text-5xl">🔍🍠</p>
          <p className="mt-3 font-display text-xl text-goguma-800">딱 맞는 매물이 없어요.</p>
          <p className="mt-1 text-sm text-goguma-500">다른 단어로 찾아보거나, 아래 비슷한 매물을 구경해 보세요.</p>
        </div>
      )}

      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-goguma-800">🍠 비슷한 분류의 다른 매물</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <div className="bg-goguma-dots flex-1 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <Suspense fallback={<div className="h-14 animate-pulse rounded-full bg-goguma-100" />}>
          {searchParams.then((sp: SearchQuery) => {
            const q = typeof sp.q === "string" ? sp.q : "";
            const category = CATEGORIES.find((c) => c === sp.category);
            return (
              <>
                <form action="/search" className="flex gap-2">
                  {category && <input type="hidden" name="category" value={category} />}
                  <label className="flex flex-1 items-center gap-2 rounded-full border-4 border-goguma-900 bg-white px-4 py-2.5 shadow-[4px_4px_0_#3d1638] focus-within:border-goguma-600">
                    <span aria-hidden className="text-xl">🔍</span>
                    <input
                      name="q"
                      type="search"
                      defaultValue={q}
                      placeholder="어떤 고구마를 찾으세요? (예: 자전거, 의자)"
                      aria-label="판매글 검색"
                      className="w-full bg-transparent text-lg text-goguma-900 outline-none placeholder:text-goguma-300"
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-full border-4 border-goguma-900 bg-goguma-600 px-5 font-display text-white shadow-[4px_4px_0_#3d1638]"
                  >
                    찾기
                  </button>
                </form>
                <CategoryChips active={category} q={q || undefined} />
                <Suspense key={`${q}|${category}`} fallback={<div className="h-64 animate-pulse rounded-3xl bg-goguma-50" />}>
                  <Results q={q} category={category} />
                </Suspense>
              </>
            );
          })}
        </Suspense>
      </div>
    </div>
  );
}
