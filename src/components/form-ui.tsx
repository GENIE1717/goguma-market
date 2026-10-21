import type { InputHTMLAttributes } from "react";

// 폼에서 반복되는 입력칸 + 라벨
export function Field({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block space-y-1.5">
      <span className="font-display text-goguma-800">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border-2 border-goguma-200 bg-goguma-50/50 px-4 py-3 text-goguma-900 outline-none transition placeholder:text-goguma-300 focus:border-goguma-500 focus:bg-white focus:ring-4 focus:ring-goguma-100"
      />
      {hint && <span className="block text-xs text-goguma-400">{hint}</span>}
    </label>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl border-4 border-goguma-900 bg-goguma-600 py-3 font-display text-xl text-white shadow-[4px_4px_0_#3d1638] transition hover:-translate-y-0.5 hover:bg-goguma-500 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "🍠 고구마 굽는 중…" : children}
    </button>
  );
}

export function FormMessage({ error, message }: { error?: string; message?: string }) {
  if (error) {
    return (
      <p role="alert" className="rounded-xl border-2 border-carrot-500 bg-carrot-400/10 px-4 py-3 text-sm text-carrot-500">
        🥕💢 {error}
      </p>
    );
  }
  if (message) {
    return (
      <p role="status" className="rounded-xl border-2 border-leaf-500 bg-leaf-500/10 px-4 py-3 text-sm text-goguma-900">
        {message}
      </p>
    );
  }
  return null;
}
