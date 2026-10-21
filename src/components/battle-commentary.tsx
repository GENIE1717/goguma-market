"use client";

import { useEffect, useState } from "react";

const LINES = [
  "고구마의 군고구마 펀치! 효과는 굉장했다! 🔥",
  "당근이 비타민A 빔을 쐈지만… 고구마의 껍질이 너무 두꺼웠다!",
  "고구마의 '달콤한 유혹'! 당근은 침을 흘리며 혼란에 빠졌다!",
  "당근의 도망치기! …하지만 고구마 줄기에 걸려 넘어졌다!",
  "고구마의 필살기: 호박고구마 메테오!! ☄️",
  "관중석의 토끼들이 고구마를 응원하기 시작했다… 🐰",
];

// 해설 멘트가 3초마다 바뀐다
export function BattleCommentary() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % LINES.length), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <p
      key={index}
      aria-live="polite"
      className="min-h-14 rounded-2xl border-4 border-goguma-900 bg-white px-5 py-3 text-center font-display text-lg text-goguma-900 shadow-[4px_4px_0_#3d1638] sm:text-xl"
    >
      🎙️ {LINES[index]}
    </p>
  );
}
