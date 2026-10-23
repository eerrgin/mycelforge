/**
 * MycelForge command line
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { DEMO_BRIEFS, formulate, toMarkdown, toProtocolJson } from "../src/lib/mycel/index.ts";
import type { DesignBrief } from "../src/lib/mycel/types.ts";

const args = process.argv.slice(2).filter((arg) => arg !== "--json");
const asJson = process.argv.includes("--json");
const file = args[0];

function findBriefFile(input: string): string | undefined {
  // Support running from either repository root or the self-contained package.
  const candidates = [resolve(process.cwd(), input), resolve(process.cwd(), "mycelforge", input)];
  return candidates.find((candidate) => existsSync(candidate));
}

if (!file) {
  const rows: Array<{ name: string; provenance: unknown; formulation: unknown }> = [];

  for (const [name, brief] of Object.entries(DEMO_BRIEFS)) {
    const { result, error } = formulate(brief);
    if (!result) {
      console.error(`${name}: ${error}`);
      process.exitCode = 1;
      continue;
    }

    const row = result.primary;
    if (asJson) {
      rows.push({ name, ...JSON.parse(toProtocolJson(row)) });
    } else {
      console.log(
        [
          name,
          row.id,
          row.species.binomial,
          `${row.days}g`,
          row.pressed ? "pres" : "acik",
          `${row.prediction.compressiveMPa} MPa`,
          `λ ${row.prediction.lambdaWmK}`,
          `${row.prediction.densityKgM3} kg/m3`,
        ].join("\t"),
      );
    }
  }

  if (asJson) console.log(JSON.stringify(rows, null, 2));
} else {
  const path = findBriefFile(file);
  if (!path) {
    console.error(
      `Brief dosyası bulunamadı: ${file}\nÖrnek: mycelforge/examples/yalitim.json`,
    );
    process.exitCode = 1;
  } else {
    try {
      const brief = JSON.parse(readFileSync(path, "utf8")) as DesignBrief;
      const { result, error } = formulate(brief);
      if (!result) {
        console.error(error);
        process.exitCode = 1;
      } else {
        console.log(asJson ? toProtocolJson(result.primary) : toMarkdown(result.primary));
      }
    } catch (error) {
      console.error(
        `Brief okunamadı (${path}): ${error instanceof Error ? error.message : String(error)}`,
      );
      process.exitCode = 1;
    }
  }
}
