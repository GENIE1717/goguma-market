"use client";

import { useOptimistic, useState, useTransition } from "react";
import { bumpProduct, toggleLike } from "@/app/products/actions";

// 💜 좋아요 — 누르자마자 숫자가 바뀌고, 서버 저장은 뒤에서
export function LikeButton({
  productId,
  liked,
  count,
  disabled,
}: {
  productId: number;
  liked: boolean;
  count: number;
  disabled?: boolean;
}) {
  const [optimistic, setOptimistic] = useOptimistic({ liked, count });
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        disabled={disabled}
        aria-pressed={optimistic.liked}
        aria-label={optimistic.liked ? "좋아요 취소" : "좋아요"}
        title={disabled ? "내 글에는 좋아요를 누를 수 없어요" : undefined}
        onClick={() =>
          startTransition(async () => {
            setError("");
            setOptimistic({ liked: !optimistic.liked, count: optimistic.count + (optimistic.liked ? -1 : 1) });
            const result = await toggleLike(productId);
            if (result.error) setError(result.error);
          })
        }
        className={`flex h-14 w-14 flex-col items-center justify-center rounded-2xl border-4 transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-60 ${
          optimistic.liked ? "border-goguma-700 bg-goguma-100" : "border-goguma-200 bg-white hover:border-goguma-500"
        }`}
      >
        <span className={`text-2xl leading-none ${optimistic.liked ? "" : "grayscale"}`}>💜</span>
        <span className="text-xs text-goguma-700">{optimistic.count}</span>
      </button>
      {error && <span className="mt-1 text-xs text-carrot-500">{error}</span>}
    </div>
  );
}

// 🔥 다시 굽기 (끌어올리기)
export function BumpButton({ productId }: { productId: number }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await bumpProduct(productId);
            setMessage(result.error ?? "🔥 갓 구운 고구마처럼 목록 맨 위로 올라갔어요!");
          })
        }
        className="rounded-2xl border-4 border-goguma-900 bg-flesh-400 px-5 py-2.5 font-display text-goguma-900 shadow-[4px_4px_0_#3d1638] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "굽는 중…" : "🔥 다시 굽기"}
      </button>
      {message && <span className="text-xs text-goguma-600">{message}</span>}
    </div>
  );
}
