"use client";

import { useEffect, useState, useTransition } from "react";
import { previewSellRange, setSellRange, verifyLocation, type LocationState } from "./actions";
import { FormMessage } from "@/components/form-ui";

const RANGES = [
  { km: 0, label: "내 동네만" },
  { km: 2, label: "가까운 동네 (2km)" },
  { km: 5, label: "조금 먼 동네 (5km)" },
  { km: 10, label: "먼 동네까지 (10km)" },
];

// GPS 동네 인증 + 판매 가능 범위 고르기
export function LocationCard({
  neighborhood,
  verifiedAt,
  rangeKm,
}: {
  neighborhood: string;
  verifiedAt: string | null;
  rangeKm: number;
}) {
  const [state, setState] = useState<LocationState>({});
  const [locating, setLocating] = useState(false);
  const [range, setRange] = useState(rangeKm);
  const [regions, setRegions] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [pending, startTransition] = useTransition();

  // 범위를 바꾸면 들어가는 동 목록을 미리 보여 준다
  useEffect(() => {
    let cancelled = false;
    void previewSellRange(neighborhood, range).then((list) => {
      if (!cancelled) setRegions(list);
    });
    return () => {
      cancelled = true;
    };
  }, [neighborhood, range]);

  function locate() {
    setState({});
    if (!("geolocation" in navigator)) {
      setState({ error: "이 브라우저는 위치 기능을 지원하지 않아요." });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        startTransition(async () => {
          setState(await verifyLocation(pos.coords.latitude, pos.coords.longitude));
          setLocating(false);
        });
      },
      (err) => {
        setLocating(false);
        setState({
          error:
            err.code === err.PERMISSION_DENIED
              ? "위치 권한이 꺼져 있어요. 브라우저 주소창 옆 🔒 를 눌러 '위치'를 허용해 주세요."
              : "위치를 찾지 못했어요. 잠시 후 다시 시도해 주세요.",
        });
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  function saveRange(km: number) {
    setRange(km);
    startTransition(async () => setState(await setSellRange(km)));
  }

  const shortName = (name: string) => name.split(" ").at(-1);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-lg text-goguma-900">📍 {neighborhood}</p>
          <p className="text-sm text-goguma-500">
            {verifiedAt ? (
              <span className="text-leaf-500">✔ GPS 동네 인증 완료 ({new Date(verifiedAt).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })})</span>
            ) : (
              "아직 GPS 동네 인증 전이에요."
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={locate}
          disabled={locating || pending}
          className="rounded-2xl border-4 border-goguma-900 bg-leaf-500 px-4 py-2 font-display text-white shadow-[3px_3px_0_#3d1638] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
        >
          {locating ? "🛰️ 위치 찾는 중…" : "🛰️ 지금 위치로 동네 인증"}
        </button>
      </div>

      <fieldset className="space-y-2">
        <legend className="font-display text-goguma-800">판매 가능 범위</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {RANGES.map((r) => (
            <button
              key={r.km}
              type="button"
              onClick={() => saveRange(r.km)}
              disabled={pending}
              aria-pressed={range === r.km}
              className={`rounded-xl border-2 px-2 py-2 text-sm transition ${
                range === r.km
                  ? "border-goguma-700 bg-goguma-600 font-display text-white"
                  : "border-goguma-200 bg-white text-goguma-700 hover:border-goguma-500"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-goguma-600">
          {shortName(neighborhood)}
          {regions.length > 1 && ` 외 ${regions.length - 1}개 동`}에서 거래할 수 있어요.
        </p>
        {regions.length > 1 && (
          <div className="rounded-xl bg-goguma-50 p-3 text-xs text-goguma-600">
            {(showAll ? regions : regions.slice(0, 12)).map(shortName).join(" · ")}
            {regions.length > 12 && (
              <button type="button" onClick={() => setShowAll(!showAll)} className="ml-2 font-display text-goguma-700 underline">
                {showAll ? "접기" : `전체 보기 (+${regions.length - 12})`}
              </button>
            )}
          </div>
        )}
        <p className="text-xs text-goguma-400">
          동네 중심점 기준 거리예요. 지금은 범위를 저장해 두기만 하고, 범위로 매물 거르기는 다음 단계에서 붙일 예정이에요.
        </p>
      </fieldset>

      <FormMessage error={state.error} message={state.message} />
    </div>
  );
}
