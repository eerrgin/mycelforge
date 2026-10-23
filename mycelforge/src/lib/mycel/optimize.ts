/**
 * MycelForge — formulation search
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Origin: Ergin Lab biomaterials atelier.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 */

import { SPECIES, substrateById } from "./catalog.ts";
import { assess, clamp, intentAllowsPress, neutralBias, type Assessment } from "./model.ts";
import { buildRecipe, buildSteps, snapshotSpecies } from "./protocol.ts";
import { PROVENANCE, forgeId } from "./provenance.ts";
import type { Bias, BlendPart, DesignBrief, Formulation, IntentId, Observation, Prediction, Priority, SubstrateId } from "./types.ts";

const MOISTURES = [0.56, 0.62, 0.68];

type Axis =
  | "strength"
  | "flex"
  | "insul"
  | "water"
  | "sorption"
  | "acoustic"
  | "light"
  | "speed"
  | "carbon"
  | "cost";

const BASE_WEIGHTS: Record<IntentId, Record<Axis, number>> = {
  "load-bearing": { strength: 0.4, flex: 0.2, insul: 0.02, water: 0, sorption: 0, acoustic: 0, light: 0.04, speed: 0.1, carbon: 0.1, cost: 0.14 },
  insulation: { strength: 0.08, flex: 0.04, insul: 0.42, water: 0, sorption: 0, acoustic: 0.06, light: 0.16, speed: 0.08, carbon: 0.08, cost: 0.08 },
  "water-retention": { strength: 0.1, flex: 0.04, insul: 0, water: 0.48, sorption: 0.04, acoustic: 0, light: 0.06, speed: 0.08, carbon: 0.08, cost: 0.12 },
  "toxin-sorption": { strength: 0.08, flex: 0.04, insul: 0, water: 0.08, sorption: 0.46, acoustic: 0, light: 0.04, speed: 0.08, carbon: 0.1, cost: 0.12 },
  lightweight: { strength: 0.12, flex: 0.06, insul: 0.14, water: 0, sorption: 0, acoustic: 0.04, light: 0.36, speed: 0.1, carbon: 0.08, cost: 0.1 },
  packaging: { strength: 0.16, flex: 0.08, insul: 0.1, water: 0.04, sorption: 0, acoustic: 0.04, light: 0.12, speed: 0.18, carbon: 0.14, cost: 0.14 },
  acoustic: { strength: 0.08, flex: 0.04, insul: 0.1, water: 0, sorption: 0, acoustic: 0.46, light: 0.1, speed: 0.06, carbon: 0.08, cost: 0.08 },
  filtration: { strength: 0.12, flex: 0.06, insul: 0, water: 0.12, sorption: 0.38, acoustic: 0, light: 0.06, speed: 0.08, carbon: 0.08, cost: 0.1 },
};

function weightsFor(intent: IntentId, priority: Priority): Record<Axis, number> {
  const w = { ...BASE_WEIGHTS[intent] };
  const boost: Partial<Record<Priority, Axis[]>> = {
    strength: ["strength", "flex"],
    speed: ["speed"],
    cost: ["cost"],
    carbon: ["carbon"],
  };
  for (const axis of boost[priority] ?? []) w[axis] *= 2.1;
  const sum = Object.values(w).reduce((s, n) => s + n, 0);
  (Object.keys(w) as Axis[]).forEach((k) => {
    w[k] /= sum;
  });
  return w;
}

function utility(p: Prediction): Record<Axis, number> {
  return {
    strength: clamp(p.compressiveMPa / 1.8, 0, 1),
    flex: clamp(p.flexuralMPa / 1.2, 0, 1),
    insul: clamp((0.125 - p.lambdaWmK) / 0.09, 0, 1),
    water: clamp(p.waterGPerG / 3.2, 0, 1),
    sorption: clamp(p.sorptionMgPerG / 70, 0, 1),
    acoustic: clamp(p.nrc, 0, 1),
    light: clamp((400 - p.densityKgM3) / 340, 0, 1),
    speed: clamp((30 - p.days) / 24, 0, 1),
    carbon: clamp((0.55 - p.co2eKgPerKg) / 0.45, 0, 1),
    cost: clamp((70 - p.costIndex) / 60, 0, 1),
  };
}

export function scoreAssessment(a: Assessment, brief: DesignBrief): number {
  const w = weightsFor(brief.intent, brief.priority);
  const u = utility(a.prediction);
  let score = 0;
  (Object.keys(w) as Axis[]).forEach((k) => {
    score += w[k] * u[k];
  });
  if (a.prediction.colonization < 0.7) score *= 0.4;
  else if (a.prediction.colonization < 0.8) score *= 0.78;
  if (a.days > brief.maxDays) score *= 0.15;
  if (brief.press === "off" && a.pressed) score = 0;
  if (brief.press === "on" && !a.pressed) score = 0;
  return score;
}

function candidateBlends(ids: SubstrateId[]): BlendPart[][] {
  const unique = [...new Set(ids)];
  const singles: BlendPart[][] = unique.map((id) => [{ substrateId: id, fraction: 1 }]);
  const pairs: { score: number; blend: BlendPart[] }[] = [];
  for (const a of unique) {
    for (const b of unique) {
      if (a === b) continue;
      const sa = substrateById(a);
      const sb = substrateById(b);
      const score = Math.abs(sa.cn - sb.cn) / 120 + Math.abs(sa.hydrophilicity - sb.hydrophilicity);
      pairs.push({
        score,
        blend: [
          { substrateId: a, fraction: 0.7 },
          { substrateId: b, fraction: 0.3 },
        ],
      });
    }
  }
  pairs.sort((x, y) => y.score - x.score);
  return [...singles, ...pairs.slice(0, 12).map((p) => p.blend)];
}

function dayOptions(speciesDays: number, maxDays: number): number[] {
  const raw = [Math.round(speciesDays * 0.8), speciesDays, Math.round(speciesDays * 1.2)];
  const clipped = raw.map((d) => Math.min(maxDays, Math.max(6, d)));
  return [...new Set(clipped)];
}

function blendKey(blend: BlendPart[]): string {
  return blend.map((p) => `${p.substrateId}:${p.fraction}`).join("+");
}

function reasons(a: Assessment, brief: DesignBrief, bias: Bias): string[] {
  const lines: string[] = [];
  const main = [...a.blend].sort((x, y) => y.fraction - x.fraction)[0];
  lines.push(
    `${a.species.binomial} (${a.species.cultureBook}) bu amaçta arama skorunun başına geçti. ${a.species.erginNote}`,
  );
  if (main) {
    const name = a.blend
      .map((p) => `${Math.round(p.fraction * 100)} ${substrateById(p.substrateId).nameTr}`)
      .join(" / ");
    lines.push(`Kuru karışım: ${name}. Karışım C:N kepek sonrası ${a.cn}.`);
  }
  if (a.pressed) lines.push("Pres açık: yoğunluk ve basma dayanımı yükselsin diye Ergin Lab sıcak pres yazdı.");
  else lines.push("Pres kapalı: açık hücre, daha düşük ısı iletkenliği ve daha hafif parça için.");
  if (a.prediction.colonization < 0.8) {
    lines.push("Kolonizasyon henüz rahat değil. Süre tavanı veya substrat eşleşmesi bunu sınırlıyor.");
  }
  if (bias.n > 0) {
    lines.push(
      `Açık ölçümler modele işlendi (n=${bias.n}, laboratuvar n=${bias.labN}). Basınç katsayısı ×${bias.strength.toFixed(2)}.`,
    );
  }
  if (brief.priority !== "balanced") {
    lines.push("Seçilen öncelik skor ağırlığını kaydırdı; bu yüzden ham amaç ağırlığı tek başına belirleyici değildir.");
  }
  return lines;
}

function materialize(a: Assessment, brief: DesignBrief, score: number, bias: Bias): Formulation {
  const species = snapshotSpecies(a);
  const recipe = buildRecipe(a.blend, brief, a.branFraction, a.gypsumGPerKg, a.caco3GPerKg, a.moisture, a.inoculumFraction);
  const steps = buildSteps(a, brief);
  const why = reasons(a, brief, bias);
  const id = forgeId(
    [
      brief.intent,
      brief.scale,
      brief.climate,
      species.id,
      blendKey(a.blend),
      a.moisture,
      a.days,
      a.pressed ? "P" : "U",
      a.cn,
      bias.strength.toFixed(3),
      bias.density.toFixed(3),
      PROVENANCE.modelVersion,
    ].join("|"),
  );
  return {
    id,
    signature: PROVENANCE.signature,
    laboratory: PROVENANCE.laboratory,
    principal: PROVENANCE.principal,
    modelVersion: PROVENANCE.modelVersion,
    brief,
    species,
    blend: a.blend,
    branFraction: a.branFraction,
    gypsumGPerKg: a.gypsumGPerKg,
    caco3GPerKg: a.caco3GPerKg,
    inoculumFraction: a.inoculumFraction,
    moisture: a.moisture,
    temperatureC: a.temperatureC,
    relativeHumidity: a.relativeHumidity,
    days: a.days,
    pressed: a.pressed,
    autoclave: a.autoclave,
    dryC: a.dryC,
    dryHours: a.dryHours,
    pressC: a.pressC,
    pressMPa: a.pressMPa,
    pressMin: a.pressMin,
    cn: a.cn,
    prediction: a.prediction,
    score: Math.round(score * 1000) / 1000,
    reasons: why,
    recipe,
    steps,
    biasApplied: bias.n > 0,
  };
}

export function biasFrom(observations: Observation[]): Bias {
  const buckets: Record<"strength" | "density" | "lambda" | "water" | "sorption", { v: number; w: number }[]> = {
    strength: [],
    density: [],
    lambda: [],
    water: [],
    sorption: [],
  };
  let labN = 0;
  for (const obs of observations) {
    const w = obs.source === "lab-import" ? 1 : 0.35;
    if (obs.source === "lab-import") labN += 1;
    const push = (
      key: keyof typeof buckets,
      measured: number | undefined,
      ref: number,
    ) => {
      if (measured === undefined || ref <= 0 || measured <= 0) return;
      buckets[key].push({ v: clamp(measured / ref, 0.35, 2), w });
    };
    push("strength", obs.compressiveMPa, obs.reference.compressiveMPa);
    push("density", obs.densityKgM3, obs.reference.densityKgM3);
    push("lambda", obs.lambdaWmK, obs.reference.lambdaWmK);
    push("water", obs.waterGPerG, obs.reference.waterGPerG);
    push("sorption", obs.sorptionMgPerG, obs.reference.sorptionMgPerG);
  }
  const shrink = (arr: { v: number; w: number }[]) => {
    if (!arr.length) return 1;
    const wsum = arr.reduce((s, x) => s + x.w, 0);
    const log = arr.reduce((s, x) => s + Math.log(x.v) * x.w, 0) / wsum;
    const raw = Math.exp(log);
    const k = wsum / (wsum + 2);
    return 1 * (1 - k) + raw * k;
  };
  return {
    strength: round3(shrink(buckets.strength)),
    density: round3(shrink(buckets.density)),
    lambda: round3(shrink(buckets.lambda)),
    water: round3(shrink(buckets.water)),
    sorption: round3(shrink(buckets.sorption)),
    n: observations.length,
    labN,
  };
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export interface SearchHit {
  assessment: Assessment;
  score: number;
}

export function search(brief: DesignBrief, bias: Bias = neutralBias()): { hits: SearchHit[]; evaluated: number } {
  if (brief.substrates.length === 0) return { hits: [], evaluated: 0 };
  const blends = candidateBlends(brief.substrates);
  const allowPress = intentAllowsPress(brief.intent, brief.press);
  const pressOptions = brief.press === "on" ? [true] : brief.press === "off" ? [false] : allowPress ? [false, true] : [false];
  const hits: SearchHit[] = [];
  let evaluated = 0;
  for (const species of SPECIES) {
    const daysList = dayOptions(species.nominalDays, brief.maxDays);
    for (const blend of blends) {
      for (const moisture of MOISTURES) {
        for (const days of daysList) {
          for (const pressed of pressOptions) {
            const assessment = assess(species, blend, moisture, days, pressed, brief, bias);
            const score = scoreAssessment(assessment, brief);
            evaluated += 1;
            if (score <= 0) continue;
            hits.push({ assessment, score });
          }
        }
      }
    }
  }
  hits.sort((a, b) => b.score - a.score);
  return { hits, evaluated };
}

function diversify(hits: SearchHit[]): SearchHit[] {
  const picked: SearchHit[] = [];
  for (const hit of hits) {
    if (picked.length === 0) {
      picked.push(hit);
      continue;
    }
    const speciesId = hit.assessment.species.id;
    const pressed = hit.assessment.pressed;
    const distinct = picked.every(
      (p) => p.assessment.species.id !== speciesId || p.assessment.pressed !== pressed,
    );
    if (distinct) picked.push(hit);
    if (picked.length === 3) break;
  }
  for (const hit of hits) {
    if (picked.length >= 3) break;
    if (!picked.includes(hit)) picked.push(hit);
  }
  return picked;
}

export function formulate(brief: DesignBrief, observations: Observation[] = []): { result: import("./types.ts").ForgeResult | null; error?: string } {
  if (brief.substrates.length === 0) {
    return { result: null, error: "En az bir atık seçilmeden Ergin Lab formül yazmaz." };
  }
  const bias = observations.length ? biasFrom(observations) : neutralBias();
  const { hits, evaluated } = search(brief, bias);
  if (!hits.length) return { result: null, error: "Bu kısıtlarla kolonize olan aday çıkmadı. Süre tavanını veya atık listesini aç." };
  const top = diversify(hits);
  const made = top.map((h) => materialize(h.assessment, brief, h.score, bias));
  const primary = made[0];
  if (!primary) return { result: null, error: "Aday üretilemedi." };
  return {
    result: {
      primary,
      alternatives: made.slice(1),
      evaluated,
      bias,
    },
  };
}

export function referenceOf(f: Formulation): Observation["reference"] {
  return {
    compressiveMPa: f.prediction.compressiveMPa,
    densityKgM3: f.prediction.densityKgM3,
    lambdaWmK: f.prediction.lambdaWmK,
    waterGPerG: f.prediction.waterGPerG,
    sorptionMgPerG: f.prediction.sorptionMgPerG,
  };
}
