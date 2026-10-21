"use client";

import { useState } from "react";
import { SelectField } from "@/components/form-ui";
import { REGIONS, SIDO_LIST } from "@/lib/regions";

// 시/도 → 시/군/구 → 읍/면/동 순서로 고르는 필터. 위 단계를 바꾸면 아래 단계는 비워진다.
export function RegionSelect({ defaultValue }: { defaultValue?: { sido?: string; sgg?: string; dong?: string } }) {
  const [sido, setSido] = useState(defaultValue?.sido ?? "");
  const [sgg, setSgg] = useState(defaultValue?.sgg ?? "");
  const [dong, setDong] = useState(defaultValue?.dong ?? "");

  const sggList = sido ? Object.keys(REGIONS[sido] ?? {}) : [];
  const dongList = sido && sgg ? (REGIONS[sido]?.[sgg] ?? []) : [];

  return (
    <fieldset className="space-y-1.5">
      <legend className="font-display text-goguma-800">우리 동네</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        <SelectField
          label="시/도"
          name="sido"
          value={sido}
          onChange={(e) => {
            setSido(e.target.value);
            setSgg("");
            setDong("");
          }}
          required
        >
          <option value="" disabled>
            시/도 선택
          </option>
          {SIDO_LIST.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="시/군/구"
          name="sgg"
          value={sgg}
          onChange={(e) => {
            setSgg(e.target.value);
            setDong("");
          }}
          disabled={!sido}
          required
        >
          <option value="" disabled>
            {sido ? "시/군/구 선택" : "시/도를 먼저"}
          </option>
          {sggList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="읍/면/동"
          name="dong"
          value={dong}
          onChange={(e) => setDong(e.target.value)}
          disabled={!sgg}
          required
        >
          <option value="" disabled>
            {sgg ? "읍/면/동 선택" : "시/군/구를 먼저"}
          </option>
          {dongList.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </SelectField>
      </div>
      <span className="block text-xs text-goguma-400">행정동 기준 (출처: 통계청 SGIS · vuski/admdongkor, CC BY 4.0)</span>
    </fieldset>
  );
}
