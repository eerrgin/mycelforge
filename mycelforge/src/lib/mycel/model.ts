/**
 * MycelForge — screening model
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Origin: Ergin Lab biomaterials atelier.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 * Model version: ergin-lab.mycelforge.model.v1
 *
 * Empirical design model, not a certified test method.
 * Anchors, not fitted private data:
 * - Cellular-solid scaling in the Gibson–Ashby sense (strength rises faster than density).
 * - Published mycelium-composite bands: unpressed foams often ~60–180 kg/m³,
 *   compressive strength well under 1 MPa; hot-pressed panels denser and stronger
 *   (Jones reviews; Appels fabrication factors; Elsacker process variables).
 * - Pure mycelium films (Haneef et al., 2017) are a different product class and
 *   are not used as the strength target here.
 * Coefficients are Ergin Lab v1 knobs sitting inside those bands.
 */

import { BRAND_CN, INTENT_CN, substrateById, type Species } from "./catalog.ts";
import type { Bias, BlendPart, Climate, DesignBrief, IntentId, Prediction, Scale } from "./types.ts";

export const CALIBRATION = {
  version: "ergin-lab.mycelforge.model.v1",
  strengthA: 0.15,
  strengthB: 1.65,
  strengthC: 1.12,
  wallDensity: 1300,
} as const;

const CLIMATE_RISK: Record<Climate, number> = {
  temperate: 1,
  humid: 1.28,
  arid: 0.8,
  cold: 0.95,
};

export interface Assessment {
  species: Species;
  blend: BlendPart[];
  moisture: number;
  days: number;
  pressed: boolean;
  temperatureC: number;
  relativeHumidity: number;
  branFraction: number;
  gypsumGPerKg: number;
  caco3GPerKg: number;
  inoculumFraction: number;
  autoclave: boolean;
  dryC: number;
  dryHours: number;
  pressC?: number;
  pressMPa?: number;
  pressMin?: number;
  cn: number;
  fit: number;
  prediction: Prediction;
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function round(n: number, digits: number): number {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

function mixCN(blend: BlendPart[]): number {
  let nitrogen = 0;
  for (const part of blend) {
    nitrogen += part.fraction / substrateById(part.substrateId).cn;
  }
  return 1 / nitrogen;
}

function branFraction(cn: number, target: number, allowBran: boolean): number {
  if (!allowBran || cn <= target) return 0;
  const extra = (1 - target / cn) / (target / BRAND_CN - 1);
  if (!Number.isFinite(extra) || extra <= 0) return 0;
  return Math.min(0.14, extra);
}

function cnAfterBran(cn: number, bran: number): number {
  return (1 + bran) / (1 / cn + bran / BRAND_CN);
}

function pairFit(species: Species, id: BlendPart["substrateId"]): number {
  if (species.preferred.includes(id)) return 1;
  if (species.avoid.includes(id)) return 0.36;
  return 0.74;
}

function blendFit(species: Species, blend: BlendPart[]): number {
  let fit = 0;
  let coffee = 0;
  for (const part of blend) {
    fit += part.fraction * pairFit(species, part.substrateId);
    if (part.substrateId === "coffee") coffee = part.fraction;
  }
  if (coffee > 0.65 && !species.preferred.includes("coffee")) fit *= 0.6;
  return fit;
}

function weighted(blend: BlendPart[], pick: (id: BlendPart["substrateId"]) => number): number {
  let total = 0;
  for (const part of blend) total += part.fraction * pick(part.substrateId);
  return total;
}

export function neutralBias(): Bias {
  return { strength: 1, density: 1, lambda: 1, water: 1, sorption: 1, n: 0, labN: 0 };
}

/** The seam to replace later with a regression or a measured response surface. */
export function assess(
  species: Species,
  blend: BlendPart[],
  moisture: number,
  days: number,
  pressed: boolean,
  brief: DesignBrief,
  bias: Bias = neutralBias(),
): Assessment {
  const baseCN = mixCN(blend);
  const allowBran = brief.intent !== "toxin-sorption" && brief.intent !== "filtration";
  const bran = branFraction(baseCN, INTENT_CN[brief.intent], allowBran);
  const cn = cnAfterBran(baseCN, bran);
  const fit = blendFit(species, blend);
  const coffee = blend.find((p) => p.substrateId === "coffee")?.fraction ?? 0;

  const moistureFactor = Math.exp(-0.5 * ((moisture - species.moistureOpt) / 0.055) ** 2);
  let drive = moistureFactor * fit;
  const notes: string[] = [];
  if (coffee > 0.45 && moisture > 0.64) {
    drive *= 0.82;
    notes.push("Kahve payı ve nem birlikte yüksek: Ergin Lab anaerobik risk notu, kolonizasyon kırpıldı.");
  }
  if (bran >= 0.139) {
    notes.push("Kepek tavanı %14. Ergin Lab daha fazlasını bakteri çektiği için yazmaz.");
  }

  const tau = species.nominalDays / species.growthRate;
  const colonization = clamp(1 - Math.exp((-1.85 * drive * days) / tau), 0.05, 0.98);

  const bulk = weighted(blend, (id) => substrateById(id).bulk);
  const fines = weighted(blend, (id) => (id === "coffee" || id === "sawdust" ? 1 : 0));
  const packing = 76 * bulk + 16 * fines;
  const biomass = 40 * colonization * species.densityBias;
  const loose = packing + biomass;
  let density = pressed ? loose * 2.32 + 28 : loose;
  density *= 0.92 + 0.16 * bias.density;
  density = clamp(density, 52, 440);

  const cnQ = Math.exp(-0.5 * ((cn - INTENT_CN[brief.intent]) / 32) ** 2);
  const quality = 0.74 + 0.32 * cnQ;
  let compressive =
    CALIBRATION.strengthA *
    (density / 100) ** CALIBRATION.strengthB *
    colonization ** CALIBRATION.strengthC *
    species.mechanics *
    quality;
  compressive *= bias.strength;
  const flexural = compressive * (pressed ? 0.7 : 0.54) * (0.82 + 0.25 * (species.mechanics / 1.3));

  let lambda = 0.031 + 0.0002 * (density - 40) + (pressed ? 0.004 : 0.01);
  lambda *= 0.94 + 0.12 * bias.lambda;
  lambda = clamp(lambda, 0.03, 0.2);

  const porosity = clamp(1 - density / CALIBRATION.wallDensity, 0.5, 0.96);
  const hydro = weighted(blend, (id) => substrateById(id).hydrophilicity);
  let water =
    porosity * (1.45 + 1.7 * hydro) * (1.06 - 0.58 * species.hydrophobin) * (0.55 + 0.45 * colonization);
  water *= bias.water;
  water = clamp(water, 0.15, 4.2);

  const lignin = weighted(blend, (id) => substrateById(id).lignin);
  let sorption = 6 + species.laccase * 58 * (0.35 + lignin) * porosity * (0.65 + 0.35 * colonization);
  sorption *= bias.sorption;
  sorption = clamp(sorption, 2, 90);

  const strawish = weighted(blend, (id) =>
    id === "straw" || id === "hemp" || id === "corn" || id === "bagasse" ? 1 : 0,
  );
  const open = clamp(porosity * (pressed ? 0.6 : 1) * (0.72 + 0.35 * strawish), 0, 1);
  const nrc = clamp(0.2 + 0.66 * open, 0.18, 0.93);

  const carbonIn = weighted(blend, (id) => substrateById(id).carbon);
  const costIn = weighted(blend, (id) => substrateById(id).cost);
  const risk = species.contaminationRisk * CLIMATE_RISK[brief.climate] * (1 + 0.35 * coffee);
  const autoclave = risk > 0.82 || species.contaminationRisk >= 0.7 || coffee > 0.5;
  const inoculum = species.growthRate < 0.85 ? 0.15 : 0.1;
  const co2 = carbonIn + (autoclave ? 0.18 : 0.07) + 0.035 * (days / 10) + (pressed ? 0.06 : 0.03);
  const cost = 22 * costIn + 10 * (inoculum / 0.1) + days * 0.75 + (autoclave ? 6 : 2) + (pressed ? 5 : 0) + bran * 18;

  let confidence = 0.56;
  const main = [...blend].sort((a, b) => b.fraction - a.fraction)[0];
  if (main && species.preferred.includes(main.substrateId)) confidence += 0.12;
  if (colonization >= 0.8 && colonization <= 0.96) confidence += 0.05;
  if (pressed && species.mechanics >= 1.05) confidence += 0.04;
  if (coffee > 0.5) confidence -= 0.07;
  if (colonization < 0.72) confidence -= 0.08;
  if (brief.scale === "pilot") confidence -= 0.03;
  if (bias.labN > 0) confidence += 0.03 * Math.min(bias.labN, 4);
  confidence = clamp(confidence, 0.36, 0.86);

  if (colonization < 0.75) {
    notes.push("Kolonizasyon %75 altında. Ergin Lab bu partiyi malzeme saymaz; süre veya eşleşme değişmeli.");
  }
  if (brief.climate === "humid") {
    notes.push("Nemli iklim: kontaminasyon payı yükseltildi, ısıl işlem buna göre seçildi.");
  }

  const dryHours = brief.scale === "petri" ? 8 : brief.scale === "panel" ? 18 : 36;
  const gypsum = brief.intent === "toxin-sorption" ? 8 : 15;
  const caco3 = coffee >= 0.25 ? 8 : 0;

  const prediction: Prediction = {
    days,
    colonization: round(colonization, 3),
    densityKgM3: round(density, 1),
    compressiveMPa: round(compressive, 3),
    flexuralMPa: round(flexural, 3),
    lambdaWmK: round(lambda, 3),
    waterGPerG: round(water, 2),
    sorptionMgPerG: round(sorption, 1),
    nrc: round(nrc, 2),
    co2eKgPerKg: round(co2, 3),
    costIndex: round(cost, 1),
    confidence: round(confidence, 2),
    notes,
  };

  return {
    species,
    blend,
    moisture,
    days,
    pressed,
    temperatureC: species.tempOptC,
    relativeHumidity: 92,
    branFraction: round(bran, 3),
    gypsumGPerKg: gypsum,
    caco3GPerKg: caco3,
    inoculumFraction: inoculum,
    autoclave,
    dryC: pressed ? 60 : 55,
    dryHours,
    pressC: pressed ? 140 : undefined,
    pressMPa: pressed ? 2 : undefined,
    pressMin: pressed ? 15 : undefined,
    cn: round(cn, 1),
    fit: round(fit, 3),
    prediction,
  };
}

export function scaleLabel(scale: Scale): string {
  if (scale === "petri") return "Petri / kavanoz";
  if (scale === "panel") return "300 mm panel";
  return "Pilot parti";
}

export function band(value: number, confidence: number): [number, number] {
  const rel = (1 - confidence) * 0.5;
  return [value * (1 - rel), value * (1 + rel)];
}

export function intentAllowsPress(intent: IntentId, mode: DesignBrief["press"]): boolean {
  if (mode === "on") return true;
  if (mode === "off") return false;
  return intent === "load-bearing" || intent === "packaging" || intent === "filtration";
}
