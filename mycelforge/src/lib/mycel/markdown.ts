/**
 * MycelForge — protocol document
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Origin: Ergin Lab biomaterials atelier.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 */

import { substrateById } from "./catalog.ts";
import { PROVENANCE } from "./provenance.ts";
import type { Formulation } from "./types.ts";
import { INTENT_LABEL, CLIMATE_LABEL, SCALE_LABEL, PRESS_LABEL } from "./labels.ts";

function n(value: number, digits = 2): string {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function toMarkdown(f: Formulation): string {
  const blend = f.blend
    .map((p) => `${Math.round(p.fraction * 100)}% ${substrateById(p.substrateId).nameTr}`)
    .join(", ");
  const lines: string[] = [
    `# MycelForge protokolü ${f.id}`,
    "",
    `Hazırlayan: ${PROVENANCE.principal}, ${PROVENANCE.laboratory}`,
    `Sistem: ${PROVENANCE.system}`,
    `Model: ${f.modelVersion}`,
    `İmza: ${f.signature}`,
    `Köken: ${PROVENANCE.origin}`,
    "",
    "> Tarama modelidir. Islak laboratuvar ölçümünün yerine geçmez. Parti, protokolün kalite adımı ölçülmeden kapanmaz.",
    "",
    "## Amaç",
    "",
    `- Kullanım: ${INTENT_LABEL[f.brief.intent]}`,
    `- İklim notu: ${CLIMATE_LABEL[f.brief.climate]}`,
    `- Ölçek: ${SCALE_LABEL[f.brief.scale]}`,
    `- Pres kuralı: ${PRESS_LABEL[f.brief.press]}`,
    `- Süre tavanı: ${f.brief.maxDays} gün`,
    "",
    "## Formül",
    "",
    `- Tür: ${f.species.binomial} (${f.species.commonTr})`,
    `- Kültür defteri: ${f.species.cultureBook}`,
    `- Karışım (kuru): ${blend}`,
    `- Nem: %${Math.round(f.moisture * 100)}`,
    `- Sıcaklık: ${f.temperatureC} °C`,
    `- Bağıl nem: %${f.relativeHumidity}`,
    `- Süre: ${f.days} gün`,
    `- C:N: ${n(f.cn, 0)}`,
    `- Pres: ${f.pressed ? `${f.pressC} °C, ${f.pressMPa} MPa, ${f.pressMin} dk` : "yok"}`,
    `- Isıl işlem: ${f.autoclave ? "otoklav 121 °C / 45 dk" : "pastörizasyon 75 °C / 90 dk"}`,
    "",
    f.species.erginNote,
    "",
    "## Tahmin",
    "",
    `| Büyüklük | Değer |`,
    `| --- | --- |`,
    `| Kolonizasyon | %${Math.round(f.prediction.colonization * 100)} |`,
    `| Yoğunluk | ${n(f.prediction.densityKgM3, 0)} kg/m³ |`,
    `| Basma | ${n(f.prediction.compressiveMPa, 2)} MPa |`,
    `| Eğilme | ${n(f.prediction.flexuralMPa, 2)} MPa |`,
    `| Isı iletkenliği | ${n(f.prediction.lambdaWmK, 3)} W/m·K |`,
    `| Su tutma | ${n(f.prediction.waterGPerG, 2)} g/g |`,
    `| Sorpsiyon indeksi | ${n(f.prediction.sorptionMgPerG, 1)} mg/g |`,
    `| NRC benzeri | ${n(f.prediction.nrc, 2)} |`,
    `| Karbon taraması | ${n(f.prediction.co2eKgPerKg, 2)} kg CO₂e/kg |`,
    `| Maliyet indeksi | ${n(f.prediction.costIndex, 0)} |`,
    `| Güven | %${Math.round(f.prediction.confidence * 100)} |`,
    `| Uyum skoru | ${n(f.score * 100, 0)} |`,
    "",
    ...f.prediction.notes.map((note) => `- ${note}`),
    "",
    "## Neden bu",
    "",
    ...f.reasons.map((r) => `- ${r}`),
    "",
    "## Reçete",
    "",
    `| Bileşen | Kuru | Teslim hali | Not |`,
    `| --- | --- | --- | --- |`,
    ...f.recipe.map((r) => `| ${r.ingredient} | ${r.dryKg || "—"} | ${r.asReceivedKg} | ${r.role} |`),
    "",
    "## Protokol",
    "",
  ];
  f.steps.forEach((step, i) => {
    lines.push(`### ${i + 1}. ${step.title}`, "", step.detail, "");
    for (const control of step.controls) lines.push(`- ${control.label}: ${control.value}`);
    if (step.critical) lines.push("- Kritik adım.");
    lines.push("");
  });
  lines.push(
    "---",
    "",
    `${PROVENANCE.statement}`,
    `${PROVENANCE.laboratory} · ${PROVENANCE.principal} · ${PROVENANCE.signature}`,
    "",
  );
  return lines.join("\n");
}

export function toProtocolJson(f: Formulation): string {
  return JSON.stringify(
    {
      provenance: PROVENANCE,
      formulation: f,
    },
    null,
    2,
  );
}
