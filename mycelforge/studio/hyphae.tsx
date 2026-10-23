/**
 * MycelForge — colonization field
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Geometric growth trace. Not a game canvas.
 */

const BRANCHES = [
  "M200 132 V78",
  "M200 108 C150 100 112 78 78 42",
  "M200 96 C248 86 292 62 328 28",
  "M200 118 C156 112 124 96 96 74",
  "M168 88 C140 78 118 60 104 40",
  "M232 84 C262 74 286 56 304 36",
  "M120 70 C98 60 84 46 74 30",
  "M300 58 C322 48 338 36 350 22",
  "M200 78 C176 64 164 48 156 30",
  "M246 70 C268 58 282 44 292 26",
];

export function HyphaeField({ colonization }: { colonization: number }) {
  const shown = Math.max(2, Math.round(2 + colonization * (BRANCHES.length - 2)));
  return (
    <svg
      viewBox="0 0 400 140"
      className="h-36 w-full rounded-lg border border-line bg-bg sm:h-44"
      role="img"
      aria-label={`Kolonizasyon alanı, yaklaşık yüzde ${Math.round(colonization * 100)}`}
    >
      <g fill="none" strokeLinecap="round">
        {BRANCHES.slice(0, shown).map((d, index) => (
          <path
            key={d}
            d={d}
            className={index % 4 === 0 ? "stroke-accent" : "stroke-primary"}
            strokeWidth={index < 3 ? 1.8 : 1.15}
            opacity={0.45 + (index / BRANCHES.length) * 0.5}
          />
        ))}
      </g>
    </svg>
  );
}
