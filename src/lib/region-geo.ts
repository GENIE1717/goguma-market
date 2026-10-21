// 동네 중심 좌표로 "가장 가까운 동"과 "반경 안의 동"을 찾는다. (서버에서만 사용 — 좌표 파일이 커서)
// 좌표 출처: 통계청 SGIS 행정동 경계 · vuski/admdongkor ver20261001 (CC BY 4.0) 에서 중심점만 계산
import coords from "@/data/region-coords.json";

const POINTS = coords as [name: string, lat: number, lng: number][];

// 두 지점 사이 거리 (km)
function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

// GPS 위치에서 가장 가까운 동 (한국 밖이면 null)
export function nearestRegion(lat: number, lng: number) {
  let best: { name: string; km: number } | null = null;
  for (const [name, plat, plng] of POINTS) {
    const km = distanceKm(lat, lng, plat, plng);
    if (!best || km < best.km) best = { name, km };
  }
  // 가장 가까운 동 중심이 10km 넘게 떨어져 있으면 국내가 아니라고 본다
  return best && best.km <= 10 ? best : null;
}

// 내 동네 중심에서 반경 km 안에 있는 동들 (가까운 순, 내 동네 포함)
export function regionsWithin(neighborhood: string, km: number) {
  const me = POINTS.find(([name]) => name === neighborhood);
  if (!me) return [neighborhood];
  if (km === 0) return [neighborhood];
  return POINTS.map(([name, lat, lng]) => ({ name, km: distanceKm(me[1], me[2], lat, lng) }))
    .filter((p) => p.km <= km)
    .sort((a, b) => a.km - b.km)
    .map((p) => p.name);
}
