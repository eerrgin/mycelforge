/**
 * MycelForge — batch draw and lab import
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Origin: Ergin Lab biomaterials atelier.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 *
 * simulateBatch is a Monte Carlo draw inside the model error band.
 * It is not a wet-lab measurement. Real numbers enter through parseLabImport.
 */

import { forgeId } from "./provenance.ts";
import { referenceOf } from "./optimize.ts";
import type { Formulation, Observation } from "./types.ts";

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function jitter(rnd: () => number, value: number, rel: number): number {
  const span = (rnd() - 0.5) * 2 * rel;
  return value * Math.exp(span);
}

export function simulateBatch(formulation: Formulation, seed: number, at: string): Observation {
  const rnd = mulberry32(seed);
  const rel = 0.06 + (1 - formulation.prediction.confidence) * 0.22;
  const p = formulation.prediction;
  return {
    id: forgeId(`obs|${formulation.id}|${seed}`),
    at,
    source: "batch-sim",
    days: formulation.days,
    compressiveMPa: Math.round(jitter(rnd, p.compressiveMPa, rel) * 1000) / 1000,
    densityKgM3: Math.round(jitter(rnd, p.densityKgM3, rel) * 10) / 10,
    lambdaWmK: Math.round(jitter(rnd, p.lambdaWmK, rel) * 1000) / 1000,
    waterGPerG: Math.round(jitter(rnd, p.waterGPerG, rel) * 100) / 100,
    sorptionMgPerG: Math.round(jitter(rnd, p.sorptionMgPerG, rel) * 10) / 10,
    note: "Monte Carlo çekilişi. Ergin Lab model hata bandı. Islak ölçüm değildir.",
    reference: referenceOf(formulation),
  };
}

export interface LabImport {
  days?: number;
  compressiveMPa?: number;
  densityKgM3?: number;
  lambdaWmK?: number;
  waterGPerG?: number;
  sorptionMgPerG?: number;
  note?: string;
}

function num(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return value;
}

export function parseLabImport(raw: unknown, formulation: Formulation, at: string): { ok: true; observation: Observation } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "JSON bir nesne olmalı." };
  }
  const body = raw as Record<string, unknown>;
  const imported: LabImport = {
    days: num(body.days),
    compressiveMPa: num(body.compressiveMPa),
    densityKgM3: num(body.densityKgM3),
    lambdaWmK: num(body.lambdaWmK),
    waterGPerG: num(body.waterGPerG),
    sorptionMgPerG: num(body.sorptionMgPerG),
    note: typeof body.note === "string" ? body.note.slice(0, 400) : undefined,
  };
  const has =
    imported.compressiveMPa !== undefined ||
    imported.densityKgM3 !== undefined ||
    imported.lambdaWmK !== undefined ||
    imported.waterGPerG !== undefined ||
    imported.sorptionMgPerG !== undefined;
  if (!has) {
    return { ok: false, error: "En az bir ölçüm alanı gerekli: compressiveMPa, densityKgM3, lambdaWmK, waterGPerG, sorptionMgPerG." };
  }
  for (const [key, value] of Object.entries(imported)) {
    if (key === "note" || value === undefined) continue;
    if (typeof value === "number" && value < 0) return { ok: false, error: `${key} negatif olamaz.` };
  }
  const observation: Observation = {
    id: forgeId(`lab|${formulation.id}|${at}|${JSON.stringify(imported)}`),
    at,
    source: "lab-import",
    days: imported.days && imported.days > 0 ? imported.days : formulation.days,
    compressiveMPa: imported.compressiveMPa,
    densityKgM3: imported.densityKgM3,
    lambdaWmK: imported.lambdaWmK,
    waterGPerG: imported.waterGPerG,
    sorptionMgPerG: imported.sorptionMgPerG,
    note: imported.note ?? "Ergin Lab ıslak ölçümü.",
    reference: referenceOf(formulation),
  };
  return { ok: true, observation };
}
