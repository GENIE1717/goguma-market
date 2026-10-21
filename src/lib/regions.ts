// 전국 행정동 목록 { 시도: { 시군구: [읍면동...] } }
// 출처: 통계청 SGIS 행정구역 경계 · vuski/admdongkor ver20261001 (CC BY 4.0) 에서 이름만 뽑음
import regionData from "@/data/regions.json";

export const REGIONS: Record<string, Record<string, string[]>> = regionData;

export const SIDO_LIST = Object.keys(REGIONS);

// 세 단계가 실제로 있는 조합인지 확인
export function isValidRegion(sido: string, sgg: string, dong: string) {
  return REGIONS[sido]?.[sgg]?.includes(dong) ?? false;
}

// "경기도 수원시 장안구 파장동" → { sido: "경기도", sgg: "수원시 장안구", dong: "파장동" }
// 목록에 없는 옛날 값("중구 수표동" 등)이면 빈 값
export function parseRegion(neighborhood: string) {
  const parts = neighborhood.split(" ");
  const [sido, dong] = [parts[0], parts.at(-1) ?? ""];
  const sgg = parts.slice(1, -1).join(" ");
  return isValidRegion(sido, sgg, dong) ? { sido, sgg, dong } : { sido: "", sgg: "", dong: "" };
}

// "서울특별시 강남구 역삼1동" → "강남구 역삼1동" (화면에 짧게 보여 줄 때)
export function shortRegion(neighborhood: string) {
  const [first, ...rest] = neighborhood.split(" ");
  return first in REGIONS && rest.length > 0 ? rest.join(" ") : neighborhood;
}
