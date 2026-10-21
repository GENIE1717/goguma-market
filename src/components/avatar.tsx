import Image from "next/image";
import { avatarUrl } from "@/lib/images";

// 프로필 사진. 없으면 고구마 얼굴.
export function Avatar({
  path,
  nickname,
  size = 40,
  className = "",
}: {
  path: string | null | undefined;
  nickname: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-goguma-200 bg-goguma-100 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {path ? (
        <Image src={avatarUrl(path)} alt={`${nickname}님의 프로필 사진`} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span aria-label={`${nickname}님`}>🍠</span>
      )}
    </span>
  );
}
