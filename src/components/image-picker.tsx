"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { BUCKETS, IMAGE_MAX_BYTES, IMAGE_TYPES, publicImageUrl, type Bucket } from "@/lib/images";
import { createClient } from "@/lib/supabase/client";

// 사진 고르기 — 판매글 사진, 프로필 사진, 신고 증거 사진에서 같이 쓴다
// 고르는 즉시 브라우저에서 Storage 로 올리고, 폼에는 올라간 파일 경로만 hidden input(name)으로 넘긴다.
// (서버 액션 용량 제한을 피하려고)
export function ImagePicker({
  bucket = BUCKETS.product,
  name = "images",
  max = 5,
  label = "사진",
  hint = "첫 번째 사진이 대표 사진이 돼요 · 한 장 5MB 이하",
  defaultImages = [],
}: {
  bucket?: Bucket;
  name?: string;
  max?: number;
  label?: string;
  hint?: string;
  defaultImages?: string[];
}) {
  const [images, setImages] = useState(defaultImages);
  // 이번에 고른 사진은 내 컴퓨터의 파일로 바로 미리보기 (비공개 버킷도 볼 수 있게)
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList) {
    setError("");
    const room = max - images.length;
    const picked = Array.from(files).slice(0, room);
    if (files.length > room) setError(`사진은 최대 ${max}장까지예요.`);

    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setError("로그인이 풀렸어요. 다시 로그인해 주세요.");
      return;
    }

    setUploading((n) => n + picked.length);
    await Promise.all(
      picked.map(async (file) => {
        try {
          if (!IMAGE_TYPES.includes(file.type)) {
            setError("jpg, png, webp, gif 사진만 올릴 수 있어요.");
            return;
          }
          if (file.size > IMAGE_MAX_BYTES) {
            setError("사진 한 장은 5MB 이하여야 해요.");
            return;
          }
          const ext = file.type.split("/")[1].replace("jpeg", "jpg");
          const path = `${data.user.id}/${crypto.randomUUID()}.${ext}`;
          const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type });
          if (error) {
            setError(`사진을 올리다 문제가 생겼어요: ${error.message}`);
            return;
          }
          setPreviews((prev) => ({ ...prev, [path]: URL.createObjectURL(file) }));
          setImages((prev) => [...prev, path]);
        } finally {
          setUploading((n) => n - 1);
        }
      }),
    );
  }

  function remove(path: string) {
    setImages((prev) => prev.filter((p) => p !== path));
    // 이번에 새로 올린 사진이면 바로 지운다. 원래 있던 사진은 저장할 때 서버가 지운다.
    if (!defaultImages.includes(path)) {
      void createClient().storage.from(bucket).remove([path]);
    }
  }

  return (
    <div className="space-y-1.5">
      <span className="font-display text-goguma-800">
        {label}{" "}
        <span className="text-sm text-goguma-400">
          ({images.length}/{max})
        </span>
      </span>
      <div className="flex flex-wrap gap-3">
        {images.length + uploading < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-24 flex-col items-center justify-center rounded-xl border-2 border-dashed border-goguma-300 bg-goguma-50/50 text-goguma-500 transition hover:border-goguma-500 hover:bg-white"
          >
            <span className="text-2xl">📷</span>
            <span className="text-xs">사진 추가</span>
          </button>
        )}
        {images.map((path, i) => (
          <div key={path} className="relative h-24 w-24 overflow-hidden rounded-xl border-2 border-goguma-200">
            <Image
              src={previews[path] ?? publicImageUrl(bucket, path)}
              alt={`${label} ${i + 1}`}
              fill
              sizes="96px"
              unoptimized={Boolean(previews[path])}
              className="object-cover"
            />
            {i === 0 && max > 1 && (
              <span className="absolute inset-x-0 bottom-0 bg-goguma-900/70 text-center text-[10px] text-white">대표 사진</span>
            )}
            <button
              type="button"
              onClick={() => remove(path)}
              aria-label={`${label} ${i + 1} 빼기`}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-goguma-900/80 text-xs text-white hover:bg-carrot-500"
            >
              ✕
            </button>
            <input type="hidden" name={name} value={path} />
          </div>
        ))}
        {Array.from({ length: uploading }, (_, i) => (
          <div
            key={`uploading-${i}`}
            className="flex h-24 w-24 animate-pulse items-center justify-center rounded-xl bg-goguma-100 text-xs text-goguma-500"
          >
            🍠 올리는 중…
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_TYPES.join(",")}
        multiple={max > 1}
        hidden
        onChange={(e) => {
          if (e.target.files?.length) void upload(e.target.files);
          e.target.value = "";
        }}
      />
      {hint && <span className="block text-xs text-goguma-400">{hint}</span>}
      {error && <p className="text-sm text-carrot-500">🥕💢 {error}</p>}
    </div>
  );
}
