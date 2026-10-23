/**
 * MycelForge engine tests
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 */

import assert from "node:assert/strict";
import test from "node:test";
import { simulateBatch, parseLabImport } from "./batch.ts";
import { DEMO_BRIEFS, formulate } from "./index.ts";
import { toMarkdown } from "./markdown.ts";
import { PROVENANCE, assertProvenance } from "./provenance.ts";
import { SCALE_DRY_KG } from "./types.ts";

test("yalıtım preslemez, düşük iletkenlik verir", () => {
  const { result, error } = formulate(DEMO_BRIEFS.yalitim);
  assert.equal(error, undefined);
  assert.ok(result);
  assert.equal(result.primary.pressed, false);
  assert.ok(result.primary.prediction.lambdaWmK < 0.07);
  assert.ok(result.primary.prediction.densityKgM3 < 200);
  assert.ok(result.evaluated > 100);
});

test("yük taşıyan presli formül yalıtımdan daha dayanıklı", () => {
  const load = formulate(DEMO_BRIEFS.yuk).result;
  const ins = formulate(DEMO_BRIEFS.yalitim).result;
  assert.ok(load && ins);
  assert.equal(load.primary.pressed, true);
  assert.ok(load.primary.prediction.compressiveMPa > ins.primary.prediction.compressiveMPa);
});

test("toksin taraması yüksek lakkazlı tür seçer ve kepeksizdir", () => {
  const { result } = formulate(DEMO_BRIEFS.toksin);
  assert.ok(result);
  assert.ok(["trametes-versicolor", "irpex-lacteus"].includes(result.primary.species.id));
  assert.equal(result.primary.branFraction, 0);
});

test("kimlik ve imza Ergin Lab'a bağlıdır", () => {
  const { result } = formulate(DEMO_BRIEFS.yalitim);
  assert.ok(result);
  assert.ok(result.primary.id.startsWith("EL-MF-"));
  assert.equal(result.primary.signature, PROVENANCE.signature);
  assert.equal(result.primary.principal, "Ergin Kaplan");
  assert.equal(assertProvenance(result.primary), true);
  const md = toMarkdown(result.primary);
  assert.ok(md.includes("Ergin Lab"));
  assert.ok(md.includes("Ergin Kaplan"));
  assert.ok(md.includes(PROVENANCE.signature));
  assert.ok(result.primary.steps.length >= 8);
});

test("aynı brief aynı protokol kimliğini üretir", () => {
  const a = formulate(DEMO_BRIEFS.yuk).result;
  const b = formulate(DEMO_BRIEFS.yuk).result;
  assert.ok(a && b);
  assert.equal(a.primary.id, b.primary.id);
});

test("reçete kuru substrat ölçeğe uyar", () => {
  const { result } = formulate(DEMO_BRIEFS.yalitim);
  assert.ok(result);
  const dry = result.primary.recipe
    .filter((r) => r.role.startsWith("Substrat"))
    .reduce((s, r) => s + r.dryKg, 0);
  assert.ok(Math.abs(dry - SCALE_DRY_KG.panel) < 0.02);
});

test("laboratuvar ölçümü basınç tahminini aşağı çeker", () => {
  const first = formulate(DEMO_BRIEFS.yuk).result;
  assert.ok(first);
  const imported = parseLabImport(
    { compressiveMPa: first.primary.prediction.compressiveMPa * 0.55, densityKgM3: first.primary.prediction.densityKgM3 },
    first.primary,
    "2026-04-12T09:00:00.000Z",
  );
  assert.equal(imported.ok, true);
  if (!imported.ok) return;
  const second = formulate(DEMO_BRIEFS.yuk, [imported.observation]).result;
  assert.ok(second);
  assert.ok(second.primary.prediction.compressiveMPa < first.primary.prediction.compressiveMPa);
  assert.equal(second.bias.labN, 1);
});

test("sanal tur ıslak ölçüm diye işaretlenmez", () => {
  const { result } = formulate(DEMO_BRIEFS.yalitim);
  assert.ok(result);
  const obs = simulateBatch(result.primary, 7, "2026-04-12T09:00:00.000Z");
  assert.equal(obs.source, "batch-sim");
  assert.ok(obs.note?.includes("Islak ölçüm değildir"));
  assert.ok(obs.id.startsWith("EL-MF-"));
});

test("boş atık listesi formül yazmaz", () => {
  const { result, error } = formulate({ ...DEMO_BRIEFS.yalitim, substrates: [] });
  assert.equal(result, null);
  assert.ok(error);
});
