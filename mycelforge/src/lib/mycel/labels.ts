/**
 * MycelForge — labels
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Origin: Ergin Lab biomaterials atelier.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 */

import type { Climate, IntentId, PressMode, Priority, Scale } from "./types.ts";

export const INTENT_LABEL: Record<IntentId, string> = {
  "load-bearing": "Yük taşıma",
  insulation: "Yalıtım",
  "water-retention": "Su tutma",
  "toxin-sorption": "Toksin tutma",
  lightweight: "Hafiflik",
  packaging: "Ambalaj",
  acoustic: "Akustik",
  filtration: "Filtrasyon",
};

export const INTENT_BLURB: Record<IntentId, string> = {
  "load-bearing": "Basma ve eğilme öne çıkar.",
  insulation: "Düşük ısı iletkenliği, açık hücre.",
  "water-retention": "Hidrofil matris, yüksek tutma.",
  "toxin-sorption": "Lakkaz eğilimi yüksek tür, az kepek.",
  lightweight: "Düşük yoğunluk, taşınabilir panel.",
  packaging: "Hız, maliyet ve yeter dayanım.",
  acoustic: "Açık gözenek, yüksek yutuculuk.",
  filtration: "Sorpsiyon ve parçalanmayan dolgu.",
};

export const CLIMATE_LABEL: Record<Climate, string> = {
  temperate: "Ilıman",
  humid: "Nemli subtropik",
  arid: "Kurak",
  cold: "Soğuk",
};

export const SCALE_LABEL: Record<Scale, string> = {
  petri: "Kavanoz",
  panel: "Panel 300 mm",
  pilot: "Pilot parti",
};

export const PRESS_LABEL: Record<PressMode, string> = {
  auto: "Pres: otomatik",
  off: "Pres yok",
  on: "Presli",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  balanced: "Dengeli",
  strength: "Dayanım",
  speed: "Hız",
  cost: "Maliyet",
  carbon: "Karbon",
};
