// 고구마 온도 — 매너 온도를 "얼마나 잘 구워졌나"로 보여 준다
// 기본 36.5도. 내 글이 받은 좋아요 1개당 +0.1도, 나를 신고한 사람 1명당 -1도. (DB 함수 goguma_temperature)

type Stage = { min: number; name: string; emoji: string; color: string; body: string; flesh: string };

// 온도가 낮은 단계부터
const STAGES: Stage[] = [
  { min: 0, name: "꽁꽁 언 고구마", emoji: "🧊", color: "text-sky-600", body: "#9ab6d6", flesh: "#dfe9f5" },
  { min: 20, name: "생고구마", emoji: "🍠", color: "text-goguma-500", body: "#c35bb3", flesh: "#fff6d9" },
  { min: 36.5, name: "따끈한 고구마", emoji: "♨️", color: "text-goguma-700", body: "#99388b", flesh: "#ffe9a8" },
  { min: 45, name: "잘 익은 군고구마", emoji: "🔥", color: "text-flesh-500", body: "#6b2361", flesh: "#ffc53d" },
  { min: 60, name: "활활 타는 군고구마", emoji: "🌋", color: "text-carrot-500", body: "#3d1638", flesh: "#ff8a3d" },
];

export function temperatureStage(value: number) {
  return [...STAGES].reverse().find((s) => value >= s.min) ?? STAGES[0];
}

// 온도에 따라 모습이 바뀌는 고구마 그림
function GogumaIcon({ value, size }: { value: number; size: number }) {
  const stage = temperatureStage(value);
  const frozen = value < 20;
  const roasted = value >= 45;
  const onFire = value >= 60;
  const steaming = value >= 36.5;

  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden className="shrink-0 overflow-visible">
      {/* 불꽃 */}
      {onFire && (
        <g className="animate-flicker origin-bottom">
          <path d="M14 46 C10 34 18 30 16 20 C24 26 26 34 24 44 Z" fill="#ff6f0f" />
          <path d="M44 44 C42 32 50 28 50 18 C56 26 56 36 52 46 Z" fill="#ff6f0f" />
          <path d="M30 40 C28 28 34 22 32 12 C40 20 40 30 38 40 Z" fill="#ffc53d" />
        </g>
      )}
      {/* 김 */}
      {steaming && !onFire && (
        <g stroke="#c068b5" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7">
          <path className="animate-steam" d="M24 18 q-3 -5 0 -10" />
          <path className="animate-steam [animation-delay:0.6s]" d="M34 16 q-3 -5 0 -10" />
          {roasted && <path className="animate-steam [animation-delay:1.2s]" d="M44 18 q-3 -5 0 -10" />}
        </g>
      )}
      {/* 몸통 */}
      <g transform="rotate(-18 32 40)">
        <path
          d="M6 40 C6 28 22 22 34 23 C48 24 60 32 58 42 C56 52 42 56 30 55 C16 54 6 50 6 40 Z"
          fill={stage.body}
          stroke="#3d1638"
          strokeWidth="2.5"
        />
        {/* 군고구마: 껍질이 갈라져 노란 속살이 보임 */}
        {roasted && <path d="M18 34 C26 30 38 30 46 35 C40 40 26 41 18 34 Z" fill={stage.flesh} stroke="#3d1638" strokeWidth="1.5" />}
        {/* 얼굴 */}
        {frozen ? (
          <>
            <path d="M22 41 l4 2 M38 41 l-4 2" stroke="#3d1638" strokeWidth="2" strokeLinecap="round" />
            <path d="M26 48 l2 -1 l2 1 l2 -1 l2 1 l2 -1" stroke="#3d1638" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="24" cy="43" r="2.2" fill="#3d1638" />
            <circle cx="38" cy="43" r="2.2" fill="#3d1638" />
            <path d="M27 48 q4 3.5 8 0" stroke="#3d1638" strokeWidth="2" fill="none" strokeLinecap="round" />
            <ellipse cx="19" cy="47" rx="3" ry="1.8" fill="#ff8fb1" opacity="0.8" />
            <ellipse cx="43" cy="47" rx="3" ry="1.8" fill="#ff8fb1" opacity="0.8" />
          </>
        )}
      </g>
      {/* 얼음 조각 */}
      {frozen && (
        <g fill="#dff3ff" stroke="#7fb3d9" strokeWidth="1.5">
          <rect x="44" y="10" width="10" height="10" rx="2" transform="rotate(15 49 15)" />
          <rect x="8" y="14" width="8" height="8" rx="2" transform="rotate(-12 12 18)" />
        </g>
      )}
    </svg>
  );
}

// 작은 표시 (판매글 상세의 판매자 옆 등)
export function MannerTemperatureBadge({ value }: { value: number }) {
  const stage = temperatureStage(value);
  return (
    <span className="inline-flex items-center gap-1" title={`고구마 온도 ${value.toFixed(1)}℃ · ${stage.name}`}>
      <GogumaIcon value={value} size={28} />
      <span className={`font-display ${stage.color}`}>{value.toFixed(1)}℃</span>
    </span>
  );
}

// 큰 표시 (프로필) — 아이콘 + 온도계 막대 + 설명
export function MannerTemperature({ value }: { value: number }) {
  const stage = temperatureStage(value);
  // 0~99.9도를 막대 길이로
  const percent = Math.max(2, Math.min(100, (value / 99.9) * 100));

  return (
    <div className="rounded-2xl border-2 border-goguma-100 bg-goguma-50/60 p-4">
      <div className="flex items-center gap-3">
        <GogumaIcon value={value} size={56} />
        <div className="flex-1">
          <p className="text-xs text-goguma-500">고구마 온도</p>
          <p className={`font-display text-2xl ${stage.color}`}>
            {value.toFixed(1)}℃ <span className="text-base">{stage.emoji} {stage.name}</span>
          </p>
        </div>
      </div>
      <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-300 via-goguma-400 via-60% to-carrot-500"
          style={{ width: `${percent}%` }}
        />
        {/* 기본 온도 36.5도 눈금 */}
        <span className="absolute inset-y-0 w-0.5 bg-goguma-900/40" style={{ left: `${(36.5 / 99.9) * 100}%` }} />
      </div>
      <p className="mt-2 text-xs text-goguma-400">
        처음엔 36.5℃ · 내 글이 좋아요를 받을 때마다 +0.1℃ · 신고를 받으면 -1℃
      </p>
    </div>
  );
}
