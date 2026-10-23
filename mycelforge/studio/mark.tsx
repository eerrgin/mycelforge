/**
 * MycelForge mark — Ergin Lab
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 */

export function Mark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="8" className="fill-primary" />
      <g className="stroke-primary-fg" strokeWidth="1.7" fill="none" strokeLinecap="round">
        <path d="M20 31V15" />
        <path d="M20 23c-5-1.2-8-5-9.5-10" />
        <path d="M20 20c5-1.4 8-5.2 10-11" />
        <path d="M20 26c-4.2-.6-7-3-9-6.5" />
        <path d="M20 17.5c3.2-.4 5.4-2 7-4.5" />
      </g>
    </svg>
  );
}
