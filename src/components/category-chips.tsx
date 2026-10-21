import Link from "next/link";
import { CATEGORIES, CATEGORY_EMOJI, type Category } from "@/lib/products";

// 분류 버튼 줄 — 휴대폰에서는 옆으로 밀어서 본다
export function CategoryChips({ active, q }: { active?: Category; q?: string }) {
  const href = (category?: Category) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    const s = params.toString();
    return `/search${s ? `?${s}` : ""}`;
  };

  return (
    <nav aria-label="분류" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
      <ul className="flex w-max gap-2 pb-1">
        <li>
          <Link
            href={href()}
            className={`block rounded-full border-2 px-3 py-1.5 text-sm transition ${
              !active ? "border-goguma-700 bg-goguma-600 font-display text-white" : "border-goguma-200 bg-white text-goguma-700 hover:border-goguma-500"
            }`}
          >
            전체
          </Link>
        </li>
        {CATEGORIES.map((category) => (
          <li key={category}>
            <Link
              href={href(category)}
              aria-current={active === category ? "page" : undefined}
              className={`block whitespace-nowrap rounded-full border-2 px-3 py-1.5 text-sm transition ${
                active === category
                  ? "border-goguma-700 bg-goguma-600 font-display text-white"
                  : "border-goguma-200 bg-white text-goguma-700 hover:border-goguma-500"
              }`}
            >
              {CATEGORY_EMOJI[category]} {category}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
