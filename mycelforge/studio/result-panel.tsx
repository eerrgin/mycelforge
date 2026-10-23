/**
 * MycelForge — formulation sheet
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 */

import { Beaker, Download, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { substrateById } from "@/lib/mycel/catalog";
import { band } from "@/lib/mycel/model";
import { toMarkdown, toProtocolJson } from "@/lib/mycel/markdown";
import { parseLabImport, simulateBatch } from "@/lib/mycel/batch";
import type { Bias, Formulation, Observation } from "@/lib/mycel/types";
import { HyphaeField } from "./hyphae";

function tr(value: number, digits = 2): string {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function download(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-line bg-bg px-3 py-3">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-1 font-display text-2xl leading-none tabular-nums text-ink">{value}</div>
      <div className="mt-2 text-xs leading-snug text-muted">{hint}</div>
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="tabular-nums text-muted">%{Math.round(value * 100)}</span>
      </div>
      <div className="h-2 rounded-full bg-line">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.round(value * 100)}%` }} />
      </div>
    </div>
  );
}

export function ResultPanel({
  formulation,
  alternatives,
  evaluated,
  bias,
  observations,
  onSave,
  onAdd,
  onClear,
}: {
  formulation: Formulation;
  alternatives: Formulation[];
  evaluated: number;
  bias: Bias;
  observations: Observation[];
  onSave: () => void;
  onAdd: (observation: Observation) => void;
  onClear: () => void;
}) {
  const [importText, setImportText] = useState(
    '{\n  "compressiveMPa": 0.18,\n  "densityKgM3": 130,\n  "note": "Ergin Lab panel 1"\n}',
  );
  const [importError, setImportError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const p = formulation.prediction;
  const strengthBand = band(p.compressiveMPa, p.confidence);
  const blend = formulation.blend
    .map((part) => `${Math.round(part.fraction * 100)}% ${substrateById(part.substrateId).nameTr}`)
    .join(" · ");

  return (
    <section className="flex min-w-0 flex-col gap-5" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-accent">{formulation.species.cultureBook}</p>
          <h2 className="font-display text-3xl leading-tight text-balance">{formulation.species.binomial}</h2>
          <p className="text-muted">{formulation.species.commonTr}</p>
        </div>
        <p className="max-w-full break-all text-xs text-muted sm:max-w-xs sm:text-right">
          {formulation.id}
          <br />
          {evaluated} aday tarandı
          {formulation.biasApplied ? ` · ölçüm kaydırması ×${tr(bias.strength, 2)}` : ""}
        </p>
      </div>

      <HyphaeField colonization={p.colonization} />

      <p className="text-pretty text-sm leading-relaxed">{formulation.species.erginNote}</p>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-lg border border-line px-3 py-2">
          <dt className="text-muted">Kuru karışım</dt>
          <dd>{blend}</dd>
        </div>
        <div className="rounded-lg border border-line px-3 py-2">
          <dt className="text-muted">Pencere</dt>
          <dd className="tabular-nums">
            {formulation.temperatureC} °C · %{formulation.relativeHumidity} nem · {formulation.days} gün · C:N {tr(formulation.cn, 0)}
          </dd>
        </div>
        <div className="rounded-lg border border-line px-3 py-2">
          <dt className="text-muted">Isıl işlem</dt>
          <dd>{formulation.autoclave ? "Otoklav 121 °C / 45 dk" : "Pastörizasyon 75 °C / 90 dk"}</dd>
        </div>
        <div className="rounded-lg border border-line px-3 py-2">
          <dt className="text-muted">Pres</dt>
          <dd>
            {formulation.pressed
              ? `${formulation.pressC} °C, ${formulation.pressMPa} MPa, ${formulation.pressMin} dk`
              : "Yok — açık hücre bırakıldı"}
          </dd>
        </div>
      </dl>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        <Kpi label="Basma" value={`${tr(p.compressiveMPa)} MPa`} hint={`${tr(strengthBand[0])}–${tr(strengthBand[1])} model bandı`} />
        <Kpi label="Yoğunluk" value={`${tr(p.densityKgM3, 0)}`} hint="kg/m³" />
        <Kpi label="Isı iletkenliği" value={tr(p.lambdaWmK, 3)} hint="W/m·K" />
        <Kpi label="Su tutma" value={tr(p.waterGPerG)} hint="g su / g kuru" />
        <Kpi label="Sorpsiyon indeksi" value={tr(p.sorptionMgPerG, 1)} hint="mg/g tarama, izoterm değil" />
        <Kpi label="Uyum" value={tr(p.confidence * 100, 0)} hint={`güven % · skor ${tr(formulation.score * 100, 0)}`} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Meter label="Kolonizasyon" value={p.colonization} />
        <Meter label="Model güveni" value={p.confidence} />
      </div>

      {p.notes.length > 0 && (
        <ul className="list-disc space-y-1 pl-5 text-sm text-pretty text-muted">
          {p.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}

      <div>
        <h3 className="font-display text-xl">Neden bu formül</h3>
        <ul className="mt-2 space-y-2 text-sm text-pretty">
          {formulation.reasons.map((reason) => (
            <li key={reason} className="border-l-2 border-primary pl-3">
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-display text-xl">Reçete</h3>
        <div className="mt-2 max-w-full overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="text-muted">
              <tr className="border-b border-line">
                <th className="py-2 pr-3 font-medium">Bileşen</th>
                <th className="py-2 pr-3 font-medium">Kuru</th>
                <th className="py-2 pr-3 font-medium">Teslim</th>
                <th className="py-2 font-medium">Not</th>
              </tr>
            </thead>
            <tbody>
              {formulation.recipe.map((line) => (
                <tr key={line.ingredient} className="border-b border-line align-top">
                  <td className="py-2 pr-3">{line.ingredient}</td>
                  <td className="py-2 pr-3 tabular-nums">{line.dryKg ? `${line.dryKg} kg` : "—"}</td>
                  <td className="py-2 pr-3 tabular-nums">{line.asReceivedKg} kg</td>
                  <td className="py-2 text-muted">{line.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl">Protokol</h3>
        <div className="mt-2 flex flex-col gap-2">
          {formulation.steps.map((step, index) => (
            <details key={step.title} className="rounded-lg border border-line bg-bg px-3 py-2" open={step.critical && index < 3}>
              <summary className="min-h-11 cursor-pointer py-2 text-sm font-medium">
                {index + 1}. {step.title}
                <span className="ml-2 text-muted">{step.phase}</span>
              </summary>
              <p className="pb-2 text-sm text-pretty text-muted">{step.detail}</p>
              <ul className="pb-2 text-sm">
                {step.controls.map((control) => (
                  <li key={control.label}>
                    <span className="text-muted">{control.label}: </span>
                    <span className="tabular-nums">{control.value}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>

      {alternatives.length > 0 && (
        <div>
          <h3 className="font-display text-xl">Yakın adaylar</h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {alternatives.map((alt) => (
              <li key={alt.id} className="rounded-lg border border-line px-3 py-3 text-sm">
                <p className="font-medium">{alt.species.binomial}</p>
                <p className="mt-1 tabular-nums text-muted">
                  {alt.days} gün · {tr(alt.prediction.compressiveMPa)} MPa · λ {tr(alt.prediction.lambdaWmK, 3)} · skor {tr(alt.score * 100, 0)}
                </p>
                <p className="mt-1 text-muted">{alt.pressed ? "Presli" : "Pressiz"} · {alt.id}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm text-primary-fg"
          onClick={() => {
            onSave();
            setSavedFlash(true);
          }}
        >
          <Save className="size-4" aria-hidden="true" />
          Deftere yaz
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface px-4 text-sm"
          onClick={() => download(`${formulation.id}-mycelforge.md`, toMarkdown(formulation), "text/markdown;charset=utf-8")}
        >
          <Download className="size-4" aria-hidden="true" />
          Markdown
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface px-4 text-sm"
          onClick={() => download(`${formulation.id}-mycelforge.json`, toProtocolJson(formulation), "application/json")}
        >
          <Download className="size-4" aria-hidden="true" />
          JSON
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface px-4 text-sm"
          onClick={() => onAdd(simulateBatch(formulation, Date.now() % 1_000_000_000, new Date().toISOString()))}
        >
          <Beaker className="size-4" aria-hidden="true" />
          Sanal büyüme turu
        </button>
      </div>
      {savedFlash && <p className="text-sm text-primary">Deftere yazıldı. Aynı kimlik varsa kayıt güncellenir.</p>}

      <div className="rounded-lg border border-line bg-bg p-3">
        <h3 className="font-display text-xl">Ölçüm döngüsü</h3>
        <p className="mt-1 text-sm text-pretty text-muted">
          Sanal tur, modelin hata bandından bir çekiliştir; ıslak laboratuvar değildir. Gerçek tartım ve basma değerini JSON olarak işleyince Ergin Lab katsayıları kayar ve formül yeniden sıralanır.
        </p>
        <label className="mt-3 block text-sm" htmlFor="lab-json">
          Laboratuvar JSON
        </label>
        <textarea
          id="lab-json"
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          rows={5}
          className="mt-1 w-full rounded-lg border border-line bg-surface p-3 text-sm text-ink"
        />
        {importError && <p className="mt-2 text-sm text-accent">{importError}</p>}
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm text-primary-fg"
            onClick={() => {
              let raw: unknown;
              try {
                raw = JSON.parse(importText);
              } catch {
                setImportError("JSON okunamadı.");
                return;
              }
              const parsed = parseLabImport(raw, formulation, new Date().toISOString());
              if (!parsed.ok) {
                setImportError(parsed.error);
                return;
              }
              setImportError(null);
              onAdd(parsed.observation);
            }}
          >
            Ölçümü işle
          </button>
          {observations.length > 0 && (
            <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line px-4 text-sm" onClick={onClear}>
              <Trash2 className="size-4" aria-hidden="true" />
              Ölçümleri sil
            </button>
          )}
        </div>
        {observations.length > 0 && (
          <ul className="mt-3 space-y-2 text-sm">
            {observations.map((obs) => (
              <li key={obs.id} className="border-t border-line pt-2">
                <span className="text-accent">{obs.source === "lab-import" ? "Laboratuvar" : "Sanal tur"}</span>
                <span className="tabular-nums text-muted">
                  {" "}
                  · {obs.compressiveMPa !== undefined ? `${tr(obs.compressiveMPa)} MPa` : "basınç yok"}
                  {obs.densityKgM3 !== undefined ? ` · ${tr(obs.densityKgM3, 0)} kg/m³` : ""}
                </span>
                {obs.note && <p className="text-muted">{obs.note}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
