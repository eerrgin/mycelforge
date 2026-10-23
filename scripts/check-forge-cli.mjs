#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const cli = new URL("../mycelforge/cli/forge.ts", import.meta.url);
const examples = [
  ["yalitim", new URL("../mycelforge/examples/yalitim.json", import.meta.url)],
  ["yuk", new URL("../mycelforge/examples/yuk.json", import.meta.url)],
  ["toksin", new URL("../mycelforge/examples/toksin.json", import.meta.url)],
];

const jsonRun = spawnSync(
  process.execPath,
  ["--experimental-strip-types", cli.pathname, "--json"],
  { encoding: "utf8" },
);
assert.equal(jsonRun.status, 0, jsonRun.stderr || "CLI JSON komutu başarısız.");
const json = JSON.parse(jsonRun.stdout);
assert.ok(Array.isArray(json), "JSON çıktısı örnekler dizisi olmalı.");
assert.equal(json.length, 3, "Üç demo brief dönmeli.");
for (const item of json) {
  assert.ok(item.name, "Brief adı eksik.");
  assert.ok(item.formulation?.id?.startsWith("EL-MF-"), "Formül kimliği eksik.");
  assert.equal(item.provenance?.signature, "EL-MF-ERGIN-KAPLAN-2026");
}

for (const [name, example] of examples) {
  const run = spawnSync(
    process.execPath,
    ["--experimental-strip-types", cli.pathname, example.pathname, "--json"],
    { encoding: "utf8" },
  );
  assert.equal(run.status, 0, `${name} brief çalışmadı: ${run.stderr}`);
  const result = JSON.parse(run.stdout);
  assert.ok(result.formulation?.id?.startsWith("EL-MF-"), `${name} çıktısında formül yok.`);
}
console.log("✓ MycelForge CLI: demo ve üç JSON brief doğrulandı.");
