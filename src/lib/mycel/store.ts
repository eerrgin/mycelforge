/**
 * MycelForge — atelier state
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 * Browser notebook only. Not a shared laboratory database.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DesignBrief, Formulation, Observation, SavedRun, SubstrateId } from "./types.ts";

export const STUDIO_BRIEF: DesignBrief = {
  intent: "insulation",
  climate: "temperate",
  substrates: ["straw", "sawdust", "coffee", "hemp"],
  priority: "balanced",
  scale: "panel",
  press: "auto",
  maxDays: 16,
};

interface ForgeState {
  brief: DesignBrief;
  sessionObs: Observation[];
  saved: SavedRun[];
  patchBrief: (patch: Partial<DesignBrief>) => void;
  toggleSubstrate: (id: SubstrateId) => void;
  addObservation: (observation: Observation) => void;
  clearObservations: () => void;
  saveCurrent: (formulation: Formulation) => void;
  removeSaved: (id: string) => void;
  loadSaved: (id: string) => void;
}

export const useForge = create<ForgeState>()(
  persist(
    (set) => ({
      brief: STUDIO_BRIEF,
      sessionObs: [],
      saved: [],
      patchBrief: (patch) => set((s) => ({ brief: { ...s.brief, ...patch } })),
      toggleSubstrate: (id) =>
        set((s) => {
          const has = s.brief.substrates.includes(id);
          const substrates = has ? s.brief.substrates.filter((x) => x !== id) : [...s.brief.substrates, id];
          return { brief: { ...s.brief, substrates } };
        }),
      addObservation: (observation) => set((s) => ({ sessionObs: [observation, ...s.sessionObs].slice(0, 24) })),
      clearObservations: () => set({ sessionObs: [] }),
      saveCurrent: (formulation) =>
        set((s) => {
          const run: SavedRun = {
            id: formulation.id,
            savedAt: new Date().toISOString(),
            formulation,
            observations: s.sessionObs,
          };
          return { saved: [run, ...s.saved.filter((r) => r.id !== run.id)].slice(0, 40) };
        }),
      removeSaved: (id) => set((s) => ({ saved: s.saved.filter((r) => r.id !== id) })),
      loadSaved: (id) =>
        set((s) => {
          const run = s.saved.find((r) => r.id === id);
          if (!run) return s;
          return { brief: run.formulation.brief, sessionObs: run.observations };
        }),
    }),
    { name: "ergin-lab.mycelforge.v1", skipHydration: true },
  ),
);
