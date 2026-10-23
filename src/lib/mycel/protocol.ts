/**
 * MycelForge — laboratory protocol writer
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Origin: Ergin Lab biomaterials atelier.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 */

import { substrateById } from "./catalog.ts";
import type { Assessment } from "./model.ts";
import { PROVENANCE } from "./provenance.ts";
import { SCALE_DRY_KG, type BlendPart, type DesignBrief, type ProtocolStep, type RecipeLine, type SpeciesSnapshot } from "./types.ts";

function kg(n: number): string {
  if (n >= 1) return `${n.toFixed(2)} kg`;
  return `${Math.round(n * 1000)} g`;
}

function pct(fraction: number): string {
  return `%${Math.round(fraction * 100)}`;
}

export function buildRecipe(blend: BlendPart[], brief: DesignBrief, bran: number, gypsumG: number, caco3G: number, moisture: number, inoculum: number): RecipeLine[] {
  const dryKg = SCALE_DRY_KG[brief.scale];
  const lines: RecipeLine[] = [];
  let waterIn = 0;
  for (const part of blend) {
    const sub = substrateById(part.substrateId);
    const dry = dryKg * part.fraction;
    const asReceived = dry / (1 - sub.inherentMoisture);
    waterIn += asReceived - dry;
    lines.push({
      ingredient: sub.nameTr,
      dryKg: round3(dry),
      asReceivedKg: round3(asReceived),
      role: `Substrat · ${sub.particle}`,
    });
  }
  if (bran > 0) {
    const dry = dryKg * bran;
    const asReceived = dry / 0.88;
    waterIn += asReceived - dry;
    lines.push({
      ingredient: "Buğday kepeği",
      dryKg: round3(dry),
      asReceivedKg: round3(asReceived),
      role: "Azot düzeltmesi. Ergin Lab tavanı kuru substratın %14'ü.",
    });
  }
  if (gypsumG > 0) {
    const dry = (dryKg * gypsumG) / 1000;
    lines.push({
      ingredient: "Alçı (CaSO₄·2H₂O)",
      dryKg: round3(dry),
      asReceivedKg: round3(dry),
      role: "Kalsiyum ve hafif tampon. Ergin Lab standart katkısı.",
    });
  }
  if (caco3G > 0) {
    const dry = (dryKg * caco3G) / 1000;
    lines.push({
      ingredient: "Kalsiyum karbonat",
      dryKg: round3(dry),
      asReceivedKg: round3(dry),
      role: "Kahve posasının asidini tamponlar.",
    });
  }
  const solids = dryKg * (1 + bran);
  const waterTotal = (solids * moisture) / (1 - moisture);
  const waterAdd = waterTotal - waterIn;
  lines.push({
    ingredient: waterAdd >= 0 ? "Eklenecek su" : "Uzaklaştırılacak su",
    dryKg: 0,
    asReceivedKg: round3(Math.abs(waterAdd)),
    role:
      waterAdd >= 0
        ? `Hedef nem ${pct(moisture)}, yaş baz. Karışıma bu kadar su girer.`
        : "Gelen atık hedeften ıslak. Yayarak hedef neme düşür, su ekleme.",
  });
  const wet = solids + Math.max(0, waterAdd);
  const spawn = wet * inoculum;
  lines.push({
    ingredient: "Tane aşı (spawn)",
    dryKg: round3(spawn),
    asReceivedKg: round3(spawn),
    role: `Yaş karışımın ${pct(inoculum)}'i. Soğuma bitmeden eklenmez. Su hesabına dahil değildir.`,
  });
  return lines;
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function buildSteps(a: Assessment, brief: DesignBrief): ProtocolStep[] {
  const dry = SCALE_DRY_KG[brief.scale];
  const heat = a.autoclave
    ? "Otoklav 121 °C, 45 dakika, yavaş boşaltma."
    : "Pastörizasyon: çekirdek 70–75 °C'de 90 dakika. Kaynar suya bastırma kabul edilmez.";
  const steps: ProtocolStep[] = [
    {
      phase: "Hazırlık",
      title: "Atığı tart ve ele",
      detail: `Kuru madde hedefi ${kg(dry)}. Nemli gelen posa ve talaşı kuru maddeye çevirerek tart. Ergin Lab eleği: ince toz ayrı, hedef parçacık substrat notundaki aralık.`,
      controls: [
        { label: "Ölçek", value: `${dry} kg kuru` },
        { label: "Defter", value: a.species.cultureBook },
      ],
      critical: true,
    },
    {
      phase: "Hazırlık",
      title: "Katkı ve nem",
      detail:
        "Önce kuru katkıyı atığa yay, sonra suyu yedir. Avuç testi Ergin Lab'de yetmez; bir numuneyi tart-kurut-tart ile doğrula. Hedef ıslanma homojen, serbest su tabakta birikmez.",
      controls: [
        { label: "Hedef nem", value: pct(a.moisture) },
        { label: "Kepek", value: a.branFraction > 0 ? pct(a.branFraction) : "yok" },
        { label: "Alçı", value: `${a.gypsumGPerKg} g/kg kuru` },
        { label: "CaCO₃", value: a.caco3GPerKg ? `${a.caco3GPerKg} g/kg kuru` : "yok" },
      ],
      critical: true,
    },
    {
      phase: "Isıl",
      title: a.autoclave ? "Otoklav" : "Pastörizasyon",
      detail: `${heat} Torba ağzı filtreli kalsın, kapalı folyo kullanılıyorsa soğumada vakum çekmesin diye gevşek bırak.`,
      controls: [
        { label: "Yöntem", value: a.autoclave ? "121 °C / 45 dk" : "75 °C çekirdek / 90 dk" },
        { label: "Gerekçe", value: a.autoclave ? "Ergin Lab risk eşiği aşıldı" : "Hızlı tür, düşük risk" },
      ],
      critical: true,
    },
    {
      phase: "İnokülasyon",
      title: "Soğut ve aşıla",
      detail: `Çekirdek 30 °C altına inmeden aşı yok. Aşıyı laminar veya alev çevresinde yedir, torbayı kapat, filtreyi örtme. Aşı payı ${pct(a.inoculumFraction)}.`,
      controls: [
        { label: "Aşı üst sınırı", value: "30 °C" },
        { label: "Aşı", value: pct(a.inoculumFraction) },
        { label: "Tür", value: a.species.binomial },
      ],
      critical: true,
    },
    {
      phase: "İnkübasyon",
      title: "Büyüme penceresi",
      detail: `Karanlık oda. Meyve primordiumu istenmez: görürsen gaz değişimini kıs, ışık açma. ${a.days}. günde beyaz örtü homojen değilse partiyi uzatma, not düş ve ayır. Ekşi veya amonyak koku ret nedenidir.`,
      controls: [
        { label: "Sıcaklık", value: `${a.temperatureC} °C ± 1` },
        { label: "Bağıl nem", value: `%${a.relativeHumidity}` },
        { label: "Süre", value: `${a.days} gün` },
        { label: "Işık", value: "kolonizasyon boyunca karanlık" },
        { label: "Gaz", value: "filtre açık; kapalı kapta günde bir değişim" },
      ],
      critical: true,
    },
    {
      phase: "İnkübasyon",
      title: "Ara kontrol",
      detail: "Gün 4 ve yarı sürede pencere aç: beyazlık, sıcaklık kaçağı, yeşil küf (Trichoderma). Yeşil leke görülen torba odaya dönmez.",
      controls: [
        { label: "Kontrol günleri", value: `4 ve ${Math.max(5, Math.round(a.days / 2))}` },
        { label: "Ret", value: "yeşil küf, ekşi koku, serbest sıvı" },
      ],
      critical: false,
    },
  ];

  if (a.pressed && a.pressC && a.pressMPa && a.pressMin) {
    steps.push({
      phase: "Bitirme",
      title: "Sıcak pres",
      detail:
        "Tam kolonize paneli kalıba al. Pres hem sıkıştırır hem büyümeyi durdurur. Ergin Lab tek basış yazar; ikinci basış kenar çatlatır.",
      controls: [
        { label: "Sıcaklık", value: `${a.pressC} °C` },
        { label: "Basınç", value: `${a.pressMPa} MPa` },
        { label: "Süre", value: `${a.pressMin} dk` },
      ],
      critical: true,
    });
  }

  steps.push(
    {
      phase: "Bitirme",
      title: "Kurut ve inaktive et",
      detail: a.pressed
        ? "Pres çıkışı sıcak paneli tel rafta çevrilerek hedef neme indir. Canlı doku kalmamalı."
        : "Kolonize formu ışıksız kurutma rafında çevrilerek kurut. 60 °C üzerine çıkma; kabuk bağlar, iç nem kalır.",
      controls: [
        { label: "Kurutma", value: `${a.dryC} °C / ${a.dryHours} saat` },
        { label: "Çıkış nemi", value: "≤ %10 yaş baz" },
      ],
      critical: true,
    },
    {
      phase: "Kalite",
      title: "Ergin Lab kabul ölçümü",
      detail:
        "Üç tekrar: kütle/hacim ile yoğunluk, 105 °C fırın nemi, 50 mm küpte 5 mm/dk basma. Bu protokolün tahminleri tarama modelidir; parti ancak bu ölçümle kapanır.",
      controls: [
        { label: "Yoğunluk tahmini", value: `${a.prediction.densityKgM3} kg/m³` },
        { label: "Basma tahmini", value: `${a.prediction.compressiveMPa} MPa` },
        { label: "Isı iletkenliği tahmini", value: `${a.prediction.lambdaWmK} W/m·K` },
        { label: "İmza", value: PROVENANCE.signature },
      ],
      critical: true,
    },
  );
  return steps;
}

export function snapshotSpecies(a: Assessment): SpeciesSnapshot {
  return {
    id: a.species.id,
    binomial: a.species.binomial,
    commonTr: a.species.commonTr,
    cultureBook: a.species.cultureBook,
    erginNote: a.species.erginNote,
  };
}

export function recipeMassCheck(recipe: RecipeLine[], brief: DesignBrief): number {
  const substrateDry = recipe.filter((r) => r.role.startsWith("Substrat")).reduce((s, r) => s + r.dryKg, 0);
  return substrateDry - SCALE_DRY_KG[brief.scale];
}
