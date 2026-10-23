/**
 * MycelForge public engine API
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Origin: Ergin Lab biomaterials atelier.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 */

export { PROVENANCE, forgeId, assertProvenance } from "./provenance.ts";
export { SPECIES, SUBSTRATES, speciesById, substrateById, INTENT_CN } from "./catalog.ts";
export { formulate, biasFrom, search } from "./optimize.ts";
export { simulateBatch, parseLabImport } from "./batch.ts";
export { toMarkdown, toProtocolJson } from "./markdown.ts";
export { CALIBRATION, assess } from "./model.ts";
export * from "./types.ts";
export * from "./labels.ts";

import type { DesignBrief } from "./types.ts";

export const DEMO_BRIEFS: Record<string, DesignBrief> = {
  yalitim: {
    intent: "insulation",
    climate: "temperate",
    substrates: ["straw", "hemp", "sawdust"],
    priority: "balanced",
    scale: "panel",
    press: "auto",
    maxDays: 16,
  },
  yuk: {
    intent: "load-bearing",
    climate: "temperate",
    substrates: ["sawdust", "hemp", "straw"],
    priority: "strength",
    scale: "panel",
    press: "on",
    maxDays: 21,
  },
  toksin: {
    intent: "toxin-sorption",
    climate: "humid",
    substrates: ["sawdust", "straw", "coffee"],
    priority: "balanced",
    scale: "petri",
    press: "off",
    maxDays: 14,
  },
};
