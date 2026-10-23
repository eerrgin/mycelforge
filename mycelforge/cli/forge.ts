/**
 * MycelForge command line
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 */

import { readFileSync } from "node:fs";
import { DEMO_BRIEFS, formulate, toMarkdown, toProtocolJson } from "../src/lib/mycel/index.ts";
import type { DesignBrief } from "../src/lib/mycel/types.ts";

const args = process.argv.slice(2).filter((arg) => arg !== "--json");
const asJson = process.argv.includes("--json");
const file = args[0];

if (!file) {
  for (const [name, brief] of Object.entries(DEMO_BRIEFS)) {
    const { result, error } = formulate(brief);
    if (!result) {
      console.error(`${name}: ${error}`);
      process.exitCode = 1;
      continue;
    }
    const row = result.primary;
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
  process.exit();
}

const brief = JSON.parse(readFileSync(file, "utf8")) as DesignBrief;
const { result, error } = formulate(brief);
if (!result) {
  console.error(error);
  process.exit(1);
}
console.log(asJson ? toProtocolJson(result.primary) : toMarkdown(result.primary));
