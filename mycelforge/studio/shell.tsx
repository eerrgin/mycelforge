/**
 * MycelForge shell — Ergin Lab
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 */

import { Link } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { PROVENANCE } from "@/lib/mycel/provenance";
import { useForge } from "@/lib/mycel/store";
import { Mark } from "./mark";

const LINKS = [
  { to: "/", label: "Atölye" },
  { to: "/defter", label: "Defter" },
  { to: "/model", label: "Model" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useForge.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <Mark />
            <span>
              <span className="block font-display text-2xl leading-none tracking-tight">MycelForge</span>
              <span className="mt-1 block text-xs text-muted">Ergin Lab · Ergin Kaplan</span>
            </span>
          </Link>
          <nav className="flex gap-1" aria-label="Bölümler">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-muted"
                activeOptions={{ exact: true }}
                activeProps={{ className: "inline-flex min-h-11 items-center rounded-lg bg-primary/10 px-3 text-sm text-ink" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto min-w-0 max-w-6xl overflow-x-hidden px-4 py-6">{children}</main>
      <footer className="border-t border-line px-4 py-6 text-center text-xs text-muted">
        {PROVENANCE.system} · {PROVENANCE.laboratory} · {PROVENANCE.principal} · {PROVENANCE.signature}
      </footer>
    </div>
  );
}
