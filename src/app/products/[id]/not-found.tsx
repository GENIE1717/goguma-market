import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="bg-goguma-dots flex flex-1 items-center justify-center px-4 py-12">
      <div className="space-y-3 rounded-[2rem] border-4 border-goguma-900 bg-white p-10 text-center shadow-[8px_8px_0_#3d1638]">
        <p className="text-6xl">🍠❓</p>
        <p className="font-display text-2xl text-goguma-800">판매글을 찾을 수 없어요.</p>
        <p className="text-goguma-500">삭제됐거나 주소가 잘못됐을 수 있어요.</p>
        <Link
          href="/"
          className="inline-block font-display text-goguma-700 underline decoration-flesh-400 decoration-4 underline-offset-4"
        >
          목록으로 가기
        </Link>
      </div>
    </div>
  );
}
