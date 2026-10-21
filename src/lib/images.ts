// Supabase Storage 사진 버킷 — migrations 의 버킷 설정과 같아야 한다
export const BUCKETS = {
  product: "goguma-product-images",
  avatar: "goguma-avatars",
  // 비공개 (신고한 본인만 볼 수 있음)
  evidence: "goguma-report-evidence",
} as const;

export type Bucket = (typeof BUCKETS)[keyof typeof BUCKETS];

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// ImagePicker 가 만든 경로 모양: "<내 id>/<랜덤 id>.<확장자>"
const IMAGE_PATH = /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp|gif)$/;

// 폼에서 받은 사진 경로가 "내 폴더에 올린 사진"인지 확인
export function isMyImagePath(path: string, userId: string) {
  return IMAGE_PATH.test(path) && path.startsWith(`${userId}/`);
}

// 공개 버킷 사진의 주소
export function publicImageUrl(bucket: Bucket, path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export function avatarUrl(path: string) {
  return publicImageUrl(BUCKETS.avatar, path);
}
