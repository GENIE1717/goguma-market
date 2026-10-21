// 하늘에서 고구마가 쏟아진다 (가끔 당근이 섞여 떨어지며 쫓겨남)
const DROPS = [
  { left: 4, delay: 0, duration: 9, size: 28, emoji: "🍠" },
  { left: 12, delay: 3.5, duration: 11, size: 22, emoji: "🍠" },
  { left: 21, delay: 1.2, duration: 8, size: 34, emoji: "🍠" },
  { left: 30, delay: 6, duration: 12, size: 20, emoji: "🥕" },
  { left: 38, delay: 2.4, duration: 10, size: 26, emoji: "🍠" },
  { left: 47, delay: 7.5, duration: 9, size: 30, emoji: "🍠" },
  { left: 55, delay: 0.8, duration: 13, size: 22, emoji: "🍠" },
  { left: 63, delay: 4.6, duration: 8.5, size: 36, emoji: "🍠" },
  { left: 71, delay: 2, duration: 11, size: 20, emoji: "🥕" },
  { left: 79, delay: 5.5, duration: 10, size: 28, emoji: "🍠" },
  { left: 87, delay: 1.6, duration: 9.5, size: 24, emoji: "🍠" },
  { left: 95, delay: 8, duration: 12, size: 30, emoji: "🍠" },
];

export function FallingGoguma() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {DROPS.map((d, i) => (
        <span
          key={i}
          className="absolute -top-12 animate-fall opacity-60 select-none"
          style={{
            left: `${d.left}%`,
            fontSize: d.size,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            filter: d.emoji === "🥕" ? "grayscale(0.6)" : undefined,
          }}
        >
          {d.emoji}
        </span>
      ))}
    </div>
  );
}

const NEWS = [
  "🚨 [속보] 당근, 고구마밭 기습 침공 실패… \"너무 달아서 접근 불가\"",
  "📈 [경제] 군고구마 지수 사상 최고치 경신, 당근 주스는 하한가",
  "⚽ [스포츠] 고구마 FC, 당근 유나이티드에 7:0 대승",
  "☃️ [날씨] 전국 군고구마 굽기 딱 좋은 날씨, 당근은 실내 대기 권고",
  "🐰 [단독] 토끼들 \"사실 고구마도 좋아해요\" 충격 고백",
  "🔥 [생활] 겨울철 이웃과 고구마 나누기, 정(情) 지수 300% 상승",
];

// 뉴스 속보 띠 (무한 스크롤)
export function NewsTicker() {
  const items = [...NEWS, ...NEWS];
  return (
    <div className="relative overflow-hidden border-y-4 border-goguma-900 bg-flesh-300 py-2.5">
      <div className="absolute inset-y-0 left-0 z-10 flex items-center bg-goguma-700 px-4 font-display text-lg text-flesh-200 shadow-[6px_0_10px_rgba(0,0,0,0.25)]">
        고구마 뉴스
      </div>
      <div className="flex w-max animate-marquee gap-12 pl-40 whitespace-nowrap font-display text-lg text-goguma-900">
        {items.map((n, i) => (
          <span key={i}>{n}</span>
        ))}
      </div>
    </div>
  );
}

// 위아래 섹션을 이어 주는 고구마 껍질 물결
export function Wave({ fill, flip = false }: { fill: string; flip?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={`block h-10 w-full ${flip ? "rotate-180" : ""}`}
    >
      <path
        d="M0 30 Q 75 0 150 30 T 300 30 T 450 30 T 600 30 T 750 30 T 900 30 T 1050 30 T 1200 30 V60 H0 Z"
        fill={fill}
      />
    </svg>
  );
}
