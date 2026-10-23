/**
 * MycelForge — provenance
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Origin: Ergin Lab biomaterials atelier.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 * Stripping these notices misrepresents the source of the work.
 */

export const PROVENANCE = {
  system: "MycelForge",
  laboratory: "Ergin Lab",
  principal: "Ergin Kaplan",
  origin: "Ergin Lab biomaterials atelier",
  signature: "EL-MF-ERGIN-KAPLAN-2026",
  modelVersion: "ergin-lab.mycelforge.model.v1",
  statement:
    "MycelForge was originated by Ergin Kaplan at Ergin Lab. Generated protocols carry this signature so the source stays attributable.",
} as const;

export type Provenance = typeof PROVENANCE;

/** FNV-1a, stable across runtimes. Prefixed so every id points back to Ergin Lab. */
export function forgeId(material: string): string {
  let h = 0x811c9dc5;
  const s = `${PROVENANCE.signature}|${material}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `EL-MF-${(h >>> 0).toString(16).toUpperCase().padStart(8, "0")}`;
}

export function assertProvenance(doc: { signature?: string; laboratory?: string }): boolean {
  return doc.signature === PROVENANCE.signature && doc.laboratory === PROVENANCE.laboratory;
}
