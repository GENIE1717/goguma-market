import Link from "next/link";

export default function UserNotFound() {
  return (
    <div className="bg-goguma-dots flex flex-1 items-center justify-center px-4 py-12">
      <div className="space-y-3 rounded-[2rem] border-4 border-goguma-900 bg-white p-10 text-center shadow-[8px_8px_0_#3d1638]">
        <p className="text-6xl">🍠❓</p>
        <p className="font-display text-2xl text-goguma-800">이웃을 찾을 수 없어요.</p>
        <Link
          href="/"
          className="inline-block font-display text-goguma-700 underline decoration-flesh-400 decoration-4 underline-offset-4"
        >
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}
