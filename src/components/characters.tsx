import { useId } from "react";

type GogumaMood = "happy" | "angry" | "cool" | "wink";

// 우리의 주인공, 고구마 🍠
export function Goguma({
  mood = "happy",
  fist = false,
  className,
}: {
  mood?: GogumaMood;
  fist?: boolean;
  className?: string;
}) {
  const id = useId();
  const skin = `${id}-skin`;
  const shine = `${id}-shine`;

  return (
    <svg viewBox="0 0 220 150" className={className} role="img" aria-label="고구마 캐릭터">
      <defs>
        <linearGradient id={skin} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c35bb3" />
          <stop offset="55%" stopColor="#99388b" />
          <stop offset="100%" stopColor="#6b2361" />
        </linearGradient>
        <radialGradient id={shine} cx="0.35" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 잔뿌리 */}
      <path d="M28 86 Q12 92 4 108" stroke="#7a2a6f" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M190 66 Q204 56 212 40" stroke="#7a2a6f" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M200 58 Q210 60 216 66" stroke="#7a2a6f" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* 몸통 */}
      <path
        d="M26 84 C22 46 76 22 120 24 C168 26 198 52 194 82 C190 114 142 130 98 126 C52 122 30 110 26 84 Z"
        fill={`url(#${skin})`}
        stroke="#5a1f52"
        strokeWidth="3"
      />
      <path
        d="M26 84 C22 46 76 22 120 24 C168 26 198 52 194 82 C190 114 142 130 98 126 C52 122 30 110 26 84 Z"
        fill={`url(#${shine})`}
      />
      {/* 껍질 주름 */}
      <path d="M58 52 q6 -4 12 0" stroke="#5a1f52" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M150 104 q6 -4 12 0" stroke="#5a1f52" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M160 42 q5 3 10 0" stroke="#5a1f52" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M48 100 q5 3 10 0" stroke="#5a1f52" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* 볼터치 */}
      <ellipse cx="72" cy="88" rx="12" ry="7" fill="#ff8fb1" opacity="0.7" />
      <ellipse cx="150" cy="86" rx="12" ry="7" fill="#ff8fb1" opacity="0.7" />

      {/* 눈 */}
      {mood === "happy" && (
        <>
          <path d="M80 72 Q90 60 100 72" stroke="#2a0d26" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M122 70 Q132 58 142 70" stroke="#2a0d26" strokeWidth="5" fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === "wink" && (
        <>
          <circle cx="90" cy="70" r="7" fill="#2a0d26" />
          <circle cx="92" cy="67" r="2.4" fill="#fff" />
          <path d="M122 70 Q132 58 142 70" stroke="#2a0d26" strokeWidth="5" fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === "angry" && (
        <>
          <path d="M76 56 L100 64" stroke="#2a0d26" strokeWidth="5" strokeLinecap="round" />
          <path d="M146 54 L122 62" stroke="#2a0d26" strokeWidth="5" strokeLinecap="round" />
          <circle cx="90" cy="74" r="7" fill="#2a0d26" />
          <circle cx="132" cy="72" r="7" fill="#2a0d26" />
          <circle cx="92" cy="71" r="2.4" fill="#fff" />
          <circle cx="134" cy="69" r="2.4" fill="#fff" />
        </>
      )}
      {mood === "cool" && (
        <>
          {/* 선글라스 */}
          <path d="M70 62 L152 58" stroke="#111" strokeWidth="5" strokeLinecap="round" />
          <path d="M72 62 h32 q0 18 -16 18 q-16 0 -16 -18 z" fill="#111" />
          <path d="M118 60 h32 q0 18 -16 18 q-16 0 -16 -18 z" fill="#111" />
          <path d="M80 66 l8 -3" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <path d="M126 64 l8 -3" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        </>
      )}

      {/* 입 */}
      {mood === "angry" ? (
        <path d="M96 100 Q111 88 126 100 Z" fill="#2a0d26" />
      ) : (
        <>
          <path d="M98 90 Q111 106 124 90 Z" fill="#2a0d26" />
          <path d="M104 97 Q111 102 118 97" fill="#ff6f8e" />
        </>
      )}

      {/* 주먹 (전투 모드) */}
      {fist && (
        <>
          <circle cx="196" cy="96" r="14" fill="#ffd96b" stroke="#5a1f52" strokeWidth="3" />
          <path d="M190 90 v12 M196 88 v14 M202 90 v12" stroke="#5a1f52" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

type CarrotMood = "angry" | "defeated" | "sneaky";

// 영원한 라이벌, 당근 🥕
export function Carrot({ mood = "angry", className }: { mood?: CarrotMood; className?: string }) {
  const id = useId();
  const skin = `${id}-carrot`;

  return (
    <svg viewBox="0 0 120 200" className={className} role="img" aria-label="당근 캐릭터">
      <defs>
        <linearGradient id={skin} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffa25c" />
          <stop offset="60%" stopColor="#ff6f0f" />
          <stop offset="100%" stopColor="#d9530a" />
        </linearGradient>
      </defs>

      {/* 잎 */}
      <path d="M60 48 Q40 20 24 8 Q44 14 58 40" fill="#3fa34d" stroke="#2b7a36" strokeWidth="2" />
      <path d="M60 48 Q60 16 62 0 Q70 18 64 46" fill="#4cbb5a" stroke="#2b7a36" strokeWidth="2" />
      <path d="M60 48 Q82 20 100 12 Q86 30 66 48" fill="#3fa34d" stroke="#2b7a36" strokeWidth="2" />

      {/* 몸통 */}
      <path
        d="M24 56 Q60 38 96 56 Q88 120 64 194 Q60 200 56 194 Q32 120 24 56 Z"
        fill={`url(#${skin})`}
        stroke="#b4460a"
        strokeWidth="3"
      />
      <path d="M34 110 h14 M70 130 h12 M44 150 h10 M66 82 h14" stroke="#c4500b" strokeWidth="3" strokeLinecap="round" opacity="0.7" />

      {/* 얼굴 */}
      {mood === "defeated" ? (
        <>
          <path d="M36 70 l12 12 M48 70 l-12 12" stroke="#3b1a05" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 70 l12 12 M82 70 l-12 12" stroke="#3b1a05" strokeWidth="4" strokeLinecap="round" />
          <path d="M46 100 Q60 90 74 100" stroke="#3b1a05" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* 식은땀 */}
          <path d="M94 62 q6 10 0 14 q-6 -4 0 -14 z" fill="#7cc8ff" />
        </>
      ) : mood === "sneaky" ? (
        <>
          <path d="M34 76 h16" stroke="#3b1a05" strokeWidth="5" strokeLinecap="round" />
          <path d="M68 76 h16" stroke="#3b1a05" strokeWidth="5" strokeLinecap="round" />
          <path d="M46 98 Q60 106 74 96" stroke="#3b1a05" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M32 64 L52 72" stroke="#3b1a05" strokeWidth="5" strokeLinecap="round" />
          <path d="M88 64 L68 72" stroke="#3b1a05" strokeWidth="5" strokeLinecap="round" />
          <circle cx="44" cy="80" r="6" fill="#3b1a05" />
          <circle cx="76" cy="80" r="6" fill="#3b1a05" />
          <rect x="44" y="96" width="32" height="10" rx="3" fill="#fff" stroke="#3b1a05" strokeWidth="3" />
          <path d="M52 96 v10 M60 96 v10 M68 96 v10" stroke="#3b1a05" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}
