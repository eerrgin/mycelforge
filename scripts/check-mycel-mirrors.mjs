#!/usr/bin/env node
/**
 * Keep the deliberately portable MycelForge package aligned with the web app.
 * Run with: npm run check:mycel-mirrors
 */
import { readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mirrorGroups = [
  {
    name: "MycelForge engine",
    pairs: [
      "batch.ts",
      "catalog.ts",
      "engine.test.ts",
      "index.ts",
      "labels.ts",
      "markdown.ts",
      "model.ts",
      "optimize.ts",
      "protocol.ts",
      "provenance.ts",
      "types.ts",
    ].map((file) => [
      join(root, "src", "lib", "mycel", file),
      join(root, "mycelforge", "src", "lib", "mycel", file),
    ]),
  },
  {
    name: "MycelForge UI",
    pairs: [
      "hyphae.tsx",
      "library.tsx",
      "mark.tsx",
      "model-page.tsx",
      "result-panel.tsx",
      "shell.tsx",
      "studio.tsx",
    ].map((file) => [
      join(root, "src", "components", "mycel", file),
      join(root, "mycelforge", "studio", file),
    ]),
  },
  {
    name: "MycelForge routes",
    pairs: ["defter.tsx", "index.tsx", "model.tsx"].map((file) => [
      join(root, "src", "routes", file),
      join(root, "mycelforge", "studio", file),
    ]),
  },
];

const errors = [];
for (const group of mirrorGroups) {
  for (const [primary, mirror] of group.pairs) {
    try {
      const primaryText = readFileSync(primary, "utf8");
      const mirrorText = readFileSync(mirror, "utf8");
      if (primaryText !== mirrorText) {
        errors.push(`${group.name}: kopyalar farklı: ${relative(root, primary)} <> ${relative(root, mirror)}`);
      }
    } catch (error) {
      errors.push(`${group.name}: dosya okunamadı: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
if (errors.length) {
  console.error(`✗ ${errors.length} tutarsız kopya bulundu:\n${errors.map((item) => `  - ${item}`).join("\n")}`);
  process.exit(1);
}
console.log("✓ Taşınabilir MycelForge kopyaları web kaynağıyla birebir eşleşiyor.");
