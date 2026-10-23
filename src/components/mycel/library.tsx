/**
 * MycelForge notebook
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 */

import { Link, useNavigate } from "@tanstack/react-router";
import { INTENT_LABEL } from "@/lib/mycel/labels";
import { useForge } from "@/lib/mycel/store";

export function Library() {
  const saved = useForge((s) => s.saved);
  const removeSaved = useForge((s) => s.removeSaved);
  const loadSaved = useForge((s) => s.loadSaved);
  const navigate = useNavigate();

  return (
    <section>
      <h1 className="font-display text-4xl text-balance">Defter</h1>
      <p className="mt-2 max-w-2xl text-sm text-pretty text-muted">
        Bu tarayıcıdaki Ergin Lab kayıtları. Başka cihaza gitmez. Her kayıt formülün kimliğini ve imzasını taşır.
      </p>
      {saved.length === 0 ? (
        <p className="mt-8 rounded-lg border border-line bg-surface p-5 text-sm">
          Henüz satır yok. Atölyede bir formül üret, deftere yaz.
          <Link to="/" className="ml-2 text-primary">
            Atölyeye dön
          </Link>
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {saved.map((run) => (
            <li key={run.id} className="rounded-lg border border-line bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-accent">{run.formulation.species.cultureBook}</p>
                  <h2 className="font-display text-2xl">{run.formulation.species.binomial}</h2>
                  <p className="text-sm text-muted">
                    {INTENT_LABEL[run.formulation.brief.intent]} · {run.formulation.days} gün · {run.id}
                  </p>
                  <p className="mt-1 text-xs tabular-nums text-muted">
                    {new Date(run.savedAt).toLocaleString("tr-TR")} · {run.observations.length} ölçüm
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="min-h-11 rounded-lg bg-primary px-3 text-sm text-primary-fg"
                    onClick={() => {
                      loadSaved(run.id);
                      void navigate({ to: "/" });
                    }}
                  >
                    Atölyede aç
                  </button>
                  <button
                    type="button"
                    className="min-h-11 rounded-lg border border-line px-3 text-sm"
                    onClick={() => removeSaved(run.id)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
