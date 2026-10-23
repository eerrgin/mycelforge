/**
 * MycelForge atelier
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 */

import { useMemo } from "react";
import { AudioLines, Columns3, Droplets, Feather, Filter, Funnel, Package, Thermometer } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SUBSTRATES } from "@/lib/mycel/catalog";
import { formulate } from "@/lib/mycel/optimize";
import { useForge } from "@/lib/mycel/store";
import {
  CLIMATE_LABEL,
  INTENT_BLURB,
  INTENT_LABEL,
  PRESS_LABEL,
  PRIORITY_LABEL,
  SCALE_LABEL,
} from "@/lib/mycel/labels";
import type { Climate, IntentId, PressMode, Priority, Scale } from "@/lib/mycel/types";
import { CLIMATES, INTENT_IDS, PRESS_MODES, PRIORITIES, SCALES } from "@/lib/mycel/types";
import { ResultPanel } from "./result-panel";

const ICONS: Record<IntentId, LucideIcon> = {
  "load-bearing": Columns3,
  insulation: Thermometer,
  "water-retention": Droplets,
  "toxin-sorption": Filter,
  lightweight: Feather,
  packaging: Package,
  acoustic: AudioLines,
  filtration: Funnel,
};

const DAY_OPTIONS = [8, 12, 16, 21, 28];

function Choice<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm text-muted">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = option.id === value;
          return (
            <button
              key={String(option.id)}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(option.id)}
              className={
                on
                  ? "min-h-11 rounded-lg border border-primary bg-primary px-3 text-sm text-primary-fg"
                  : "min-h-11 rounded-lg border border-line bg-surface px-3 text-sm text-ink"
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Studio() {
  const brief = useForge((s) => s.brief);
  const observations = useForge((s) => s.sessionObs);
  const patchBrief = useForge((s) => s.patchBrief);
  const toggleSubstrate = useForge((s) => s.toggleSubstrate);
  const addObservation = useForge((s) => s.addObservation);
  const clearObservations = useForge((s) => s.clearObservations);
  const saveCurrent = useForge((s) => s.saveCurrent);

  const forged = useMemo(() => formulate(brief, observations), [brief, observations]);

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
      <section className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-4">
        <div>
          <h1 className="font-display text-4xl leading-none text-balance">Atölye</h1>
          <p className="mt-2 text-sm text-pretty text-muted">
            Amacı seç. Ergin Lab motoru tür, atık reçetesi, nem-sıcaklık penceresi ve laboratuvar protokolünü tarar. Sohbet değil, formül.
          </p>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm text-muted">Kullanım</legend>
          <div className="grid grid-cols-2 gap-2">
            {INTENT_IDS.map((id) => {
              const Icon = ICONS[id];
              const on = brief.intent === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => patchBrief({ intent: id })}
                  className={
                    on
                      ? "min-h-11 rounded-lg border border-primary bg-primary/10 px-2 py-2 text-left"
                      : "min-h-11 rounded-lg border border-line bg-surface px-2 py-2 text-left"
                  }
                >
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                  <span className="mt-1 block text-sm">{INTENT_LABEL[id]}</span>
                  <span className="mt-0.5 block text-xs text-pretty text-muted">{INTENT_BLURB[id]}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm text-muted">Elindeki atık</legend>
          <div className="flex flex-wrap gap-2">
            {SUBSTRATES.map((substrate) => {
              const on = brief.substrates.includes(substrate.id);
              return (
                <button
                  key={substrate.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleSubstrate(substrate.id)}
                  className={
                    on
                      ? "min-h-11 rounded-full border border-primary bg-primary px-3 text-sm text-primary-fg"
                      : "min-h-11 rounded-full border border-line bg-surface px-3 text-sm"
                  }
                >
                  {substrate.nameTr}
                </button>
              );
            })}
          </div>
        </fieldset>

        <Choice<Climate>
          label="İklim notu"
          value={brief.climate}
          options={CLIMATES.map((id) => ({ id, label: CLIMATE_LABEL[id] }))}
          onChange={(climate) => patchBrief({ climate })}
        />
        <Choice<Priority>
          label="Öncelik"
          value={brief.priority}
          options={PRIORITIES.map((id) => ({ id, label: PRIORITY_LABEL[id] }))}
          onChange={(priority) => patchBrief({ priority })}
        />
        <Choice<Scale>
          label="Ölçek"
          value={brief.scale}
          options={SCALES.map((id) => ({ id, label: SCALE_LABEL[id] }))}
          onChange={(scale) => patchBrief({ scale })}
        />
        <Choice<PressMode>
          label="Pres"
          value={brief.press}
          options={PRESS_MODES.map((id) => ({ id, label: PRESS_LABEL[id] }))}
          onChange={(press) => patchBrief({ press })}
        />
        <Choice<number>
          label="Süre tavanı"
          value={brief.maxDays}
          options={DAY_OPTIONS.map((id) => ({ id, label: `${id} gün` }))}
          onChange={(maxDays) => patchBrief({ maxDays })}
        />
      </section>

      <section className="min-w-0 rounded-lg border border-line bg-surface p-4 sm:p-5">
        {forged.result ? (
          <ResultPanel
            formulation={forged.result.primary}
            alternatives={forged.result.alternatives}
            evaluated={forged.result.evaluated}
            bias={forged.result.bias}
            observations={observations}
            onSave={() => saveCurrent(forged.result!.primary)}
            onAdd={addObservation}
            onClear={clearObservations}
          />
        ) : (
          <p className="text-sm text-accent">{forged.error}</p>
        )}
      </section>
    </div>
  );
}
