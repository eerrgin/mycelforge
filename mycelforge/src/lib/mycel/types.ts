/**
 * MycelForge — shared types
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Origin: Ergin Lab biomaterials atelier.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 */

export const INTENT_IDS = [
  "load-bearing",
  "insulation",
  "water-retention",
  "toxin-sorption",
  "lightweight",
  "packaging",
  "acoustic",
  "filtration",
] as const;

export type IntentId = (typeof INTENT_IDS)[number];

export const SUBSTRATE_IDS = [
  "straw",
  "sawdust",
  "coffee",
  "hemp",
  "rice",
  "corn",
  "cotton",
  "bagasse",
] as const;

export type SubstrateId = (typeof SUBSTRATE_IDS)[number];

export const CLIMATES = ["temperate", "humid", "arid", "cold"] as const;
export type Climate = (typeof CLIMATES)[number];

export const SCALES = ["petri", "panel", "pilot"] as const;
export type Scale = (typeof SCALES)[number];

export const PRESS_MODES = ["auto", "off", "on"] as const;
export type PressMode = (typeof PRESS_MODES)[number];

export const PRIORITIES = ["balanced", "strength", "speed", "cost", "carbon"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const SCALE_DRY_KG: Record<Scale, number> = {
  petri: 0.04,
  panel: 1.2,
  pilot: 12,
};

export interface DesignBrief {
  intent: IntentId;
  climate: Climate;
  substrates: SubstrateId[];
  priority: Priority;
  scale: Scale;
  press: PressMode;
  maxDays: number;
}

export interface BlendPart {
  substrateId: SubstrateId;
  fraction: number;
}

export interface Prediction {
  days: number;
  colonization: number;
  densityKgM3: number;
  compressiveMPa: number;
  flexuralMPa: number;
  lambdaWmK: number;
  waterGPerG: number;
  sorptionMgPerG: number;
  nrc: number;
  co2eKgPerKg: number;
  costIndex: number;
  confidence: number;
  notes: string[];
}

export interface RecipeLine {
  ingredient: string;
  dryKg: number;
  asReceivedKg: number;
  role: string;
}

export interface ProtocolControl {
  label: string;
  value: string;
}

export interface ProtocolStep {
  phase: string;
  title: string;
  detail: string;
  controls: ProtocolControl[];
  critical: boolean;
}

export interface SpeciesSnapshot {
  id: string;
  binomial: string;
  commonTr: string;
  cultureBook: string;
  erginNote: string;
}

export interface Formulation {
  id: string;
  signature: string;
  laboratory: string;
  principal: string;
  modelVersion: string;
  brief: DesignBrief;
  species: SpeciesSnapshot;
  blend: BlendPart[];
  branFraction: number;
  gypsumGPerKg: number;
  caco3GPerKg: number;
  inoculumFraction: number;
  moisture: number;
  temperatureC: number;
  relativeHumidity: number;
  days: number;
  pressed: boolean;
  autoclave: boolean;
  dryC: number;
  dryHours: number;
  pressC?: number;
  pressMPa?: number;
  pressMin?: number;
  cn: number;
  prediction: Prediction;
  score: number;
  reasons: string[];
  recipe: RecipeLine[];
  steps: ProtocolStep[];
  biasApplied: boolean;
}

export interface Observation {
  id: string;
  at: string;
  source: "batch-sim" | "lab-import";
  days: number;
  compressiveMPa?: number;
  densityKgM3?: number;
  lambdaWmK?: number;
  waterGPerG?: number;
  sorptionMgPerG?: number;
  note?: string;
  /** Model values this measurement is compared against. */
  reference: {
    compressiveMPa: number;
    densityKgM3: number;
    lambdaWmK: number;
    waterGPerG: number;
    sorptionMgPerG: number;
  };
}

export interface Bias {
  strength: number;
  density: number;
  lambda: number;
  water: number;
  sorption: number;
  n: number;
  labN: number;
}

export interface ForgeResult {
  primary: Formulation;
  alternatives: Formulation[];
  evaluated: number;
  bias: Bias;
}

export interface SavedRun {
  id: string;
  savedAt: string;
  formulation: Formulation;
  observations: Observation[];
}
