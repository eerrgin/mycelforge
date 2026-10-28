/**
 * Generate the portable MycelForge copies from canonical application sources.
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 *
 * Run: node scripts/sync-mycel-mirrors.mjs
 * Update canonical src/ files first; do not hand-edit mirrored files.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const groups = [
  ["src/lib/mycel", "mycelforge/src/lib/mycel", [
    "batch.ts", "catalog.ts", "engine.test.ts", "index.ts", "labels.ts",
    "markdown.ts", "model.ts", "optimize.ts", "protocol.ts", "provenance.ts", "types.ts"
  ]],
  ["src/components/mycel", "mycelforge/studio", [
    "hyphae.tsx", "library.tsx", "mark.tsx", "model-page.tsx",
    "result-panel.tsx", "shell.tsx", "studio.tsx"
  ]],
  ["src/routes", "mycelforge/studio", ["defter.tsx", "index.tsx", "model.tsx"]]
];

let copied = 0;
const errors = [];
for (const [sourceDir, targetDir, names] of groups) {
  for (const name of names) {
    const source = join(root, sourceDir, name);
    const target = join(root, targetDir, name);
    try {
      mkdirSync(dirname(target), { recursive: true });
      copyFileSync(source, target);
      copied += 1;
    } catch (error) {
      errors.push(`${sourceDir}/${name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
if (errors.length) {
  console.error(`Mirror sync failed after copying ${copied} files:\n${errors.map((e) => `- ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(`✓ Generated ${copied} MycelForge mirror files from canonical src/ files.`);
console.log("Run npm run check:mycel-mirrors and the relevant test/build commands.");
