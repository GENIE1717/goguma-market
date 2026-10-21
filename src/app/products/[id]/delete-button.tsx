"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/app/products/actions";

// 실수로 지우지 않도록 한 번 더 물어본다
export function DeleteButton({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("정말 이 판매글을 삭제할까요? 되돌릴 수 없어요.")) return;
        startTransition(() => deleteProduct(id));
      }}
      className="rounded-2xl border-4 border-carrot-500 bg-white px-5 py-2.5 font-display text-carrot-500 transition hover:bg-carrot-400/10 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "삭제하는 중…" : "🗑️ 삭제"}
    </button>
  );
}
