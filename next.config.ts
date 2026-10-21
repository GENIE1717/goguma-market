import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // 개발 서버를 127.0.0.1 주소로도 열 수 있게 (테스트용 두 번째 로그인 창). 실제 사이트와는 상관없다.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    // 판매글 사진(Supabase Storage 공개 버킷)만 next/image 로 불러올 수 있게 허용
    remotePatterns: [new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/**`)],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
