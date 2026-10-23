/**
 * MycelForge — species and substrate catalog
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Origin: Ergin Lab biomaterials atelier.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 *
 * Trait numbers are Ergin Lab working calibrations placed inside published
 * ranges for mycelium composites. cultureBook ids are internal Ergin Lab
 * notebook keys, not public culture-collection accessions.
 */

import type { IntentId, SubstrateId } from "./types.ts";

export interface Species {
  id: string;
  binomial: string;
  commonTr: string;
  commonEn: string;
  cultureBook: string;
  tempOptC: number;
  moistureOpt: number;
  nominalDays: number;
  /** 1 = reference colonizer. */
  growthRate: number;
  /** Multiplier on wall-derived strength. */
  mechanics: number;
  /** Extra biomass fill, 1 = reference. */
  densityBias: number;
  /** 0–1 surface hydrophobin tendency. */
  hydrophobin: number;
  /** 0–1 oxidative-enzyme (laccase) tendency. Design index, not an assay. */
  laccase: number;
  /** 0–1. Slow, exposed cultures score higher. */
  contaminationRisk: number;
  preferred: SubstrateId[];
  avoid: SubstrateId[];
  erginNote: string;
}

export interface Substrate {
  id: SubstrateId;
  nameTr: string;
  nameEn: string;
  /** Mass C:N. */
  cn: number;
  lignin: number;
  hydrophilicity: number;
  /** Loose-pack index, ~0.7–1.3. */
  bulk: number;
  /** Relative purchase cost per dry kg. */
  cost: number;
  /** Screening kg CO2e per dry kg, waste-stream assumption. */
  carbon: number;
  /** As-received moisture, wet basis. */
  inherentMoisture: number;
  particle: string;
}

export const SPECIES: Species[] = [
  {
    id: "ganoderma-lucidum",
    binomial: "Ganoderma lucidum",
    commonTr: "Reishi",
    commonEn: "reishi",
    cultureBook: "EL-CB-GL-04",
    tempOptC: 27,
    moistureOpt: 0.6,
    nominalDays: 14,
    growthRate: 0.86,
    mechanics: 1.28,
    densityBias: 1.16,
    hydrophobin: 0.46,
    laccase: 0.55,
    contaminationRisk: 0.6,
    preferred: ["sawdust", "hemp", "straw"],
    avoid: ["cotton"],
    erginNote:
      "Ergin Lab defteri EL-CB-GL-04: sert ağaç talaşında sıkı kabuk, samanda daha açık hücre. Yük paneli için presli talaş tercih edilir.",
  },
  {
    id: "ganoderma-applanatum",
    binomial: "Ganoderma applanatum",
    commonTr: "Sanatçı mantarı",
    commonEn: "artist's conk",
    cultureBook: "EL-CB-GA-02",
    tempOptC: 25,
    moistureOpt: 0.59,
    nominalDays: 18,
    growthRate: 0.7,
    mechanics: 1.22,
    densityBias: 1.12,
    hydrophobin: 0.5,
    laccase: 0.62,
    contaminationRisk: 0.64,
    preferred: ["sawdust", "hemp"],
    avoid: ["coffee"],
    erginNote:
      "Ergin Lab EL-CB-GA-02: yavaş ve tok. Uzun çevrim kabul edilebiliyorsa yük ve orta filtrasyon arasında durur.",
  },
  {
    id: "pleurotus-ostreatus",
    binomial: "Pleurotus ostreatus",
    commonTr: "Kayın mantarı",
    commonEn: "oyster",
    cultureBook: "EL-CB-PO-07",
    tempOptC: 24,
    moistureOpt: 0.64,
    nominalDays: 10,
    growthRate: 1.28,
    mechanics: 0.82,
    densityBias: 0.9,
    hydrophobin: 0.28,
    laccase: 0.36,
    contaminationRisk: 0.42,
    preferred: ["straw", "coffee", "corn", "bagasse"],
    avoid: [],
    erginNote:
      "Ergin Lab EL-CB-PO-07: en hızlı kolonizer. Kahve posası kuru payı %40'ı geçmesin; samanla seyreltilmeden sıkışıp ekşir.",
  },
  {
    id: "pleurotus-eryngii",
    binomial: "Pleurotus eryngii",
    commonTr: "Kral istiridye",
    commonEn: "king oyster",
    cultureBook: "EL-CB-PE-03",
    tempOptC: 23,
    moistureOpt: 0.62,
    nominalDays: 14,
    growthRate: 0.9,
    mechanics: 1.12,
    densityBias: 1.05,
    hydrophobin: 0.34,
    laccase: 0.3,
    contaminationRisk: 0.55,
    preferred: ["sawdust", "straw", "hemp"],
    avoid: ["rice"],
    erginNote:
      "Ergin Lab EL-CB-PE-03: istiridyeden daha sıkı hif ağı. Ambalaj ile hafif yük arasındaki geçiş türü.",
  },
  {
    id: "trametes-versicolor",
    binomial: "Trametes versicolor",
    commonTr: "Hindiba / turkey tail",
    commonEn: "turkey tail",
    cultureBook: "EL-CB-TV-05",
    tempOptC: 26,
    moistureOpt: 0.61,
    nominalDays: 12,
    growthRate: 1.05,
    mechanics: 0.96,
    densityBias: 1,
    hydrophobin: 0.4,
    laccase: 0.96,
    contaminationRisk: 0.4,
    preferred: ["sawdust", "straw", "hemp", "rice"],
    avoid: [],
    erginNote:
      "Ergin Lab EL-CB-TV-05: katalogdaki en yüksek lakkaz eğilimi. Toksin ve boya tutma taramalarında birinci aday.",
  },
  {
    id: "irpex-lacteus",
    binomial: "Irpex lacteus",
    commonTr: "Süt dişi mantarı",
    commonEn: "milk-white toothed polypore",
    cultureBook: "EL-CB-IL-01",
    tempOptC: 26,
    moistureOpt: 0.63,
    nominalDays: 11,
    growthRate: 1.12,
    mechanics: 0.78,
    densityBias: 0.88,
    hydrophobin: 0.32,
    laccase: 0.88,
    contaminationRisk: 0.48,
    preferred: ["straw", "corn", "coffee", "bagasse"],
    avoid: ["cotton"],
    erginNote:
      "Ergin Lab EL-CB-IL-01: tarımsal atıkta hızlı, lignini açar. Filtrasyon dolgusu için versicolor yedeği.",
  },
  {
    id: "schizophyllum-commune",
    binomial: "Schizophyllum commune",
    commonTr: "Ayrık solungaç",
    commonEn: "split gill",
    cultureBook: "EL-CB-SC-02",
    tempOptC: 28,
    moistureOpt: 0.58,
    nominalDays: 9,
    growthRate: 1.3,
    mechanics: 0.64,
    densityBias: 0.78,
    hydrophobin: 0.9,
    laccase: 0.4,
    contaminationRisk: 0.35,
    preferred: ["straw", "sawdust", "rice"],
    avoid: [],
    erginNote:
      "Ergin Lab EL-CB-SC-02: hidrofobin yüksek. Su tutma işi için seçilmez; nem iten hafif panel ve ambalaj kabuğu için tutulur.",
  },
  {
    id: "fomes-fomentarius",
    binomial: "Fomes fomentarius",
    commonTr: "Kav mantarı",
    commonEn: "tinder fungus",
    cultureBook: "EL-CB-FF-03",
    tempOptC: 24,
    moistureOpt: 0.58,
    nominalDays: 20,
    growthRate: 0.62,
    mechanics: 1.35,
    densityBias: 1.2,
    hydrophobin: 0.55,
    laccase: 0.5,
    contaminationRisk: 0.72,
    preferred: ["sawdust", "hemp"],
    avoid: ["coffee", "cotton"],
    erginNote:
      "Ergin Lab EL-CB-FF-03: amadou geleneğinin türü. Yavaş, tok, uzun çevrim. Otoklavsız bırakılmaz.",
  },
  {
    id: "hericium-erinaceus",
    binomial: "Hericium erinaceus",
    commonTr: "Aslan yelesi",
    commonEn: "lion's mane",
    cultureBook: "EL-CB-HE-02",
    tempOptC: 22,
    moistureOpt: 0.63,
    nominalDays: 16,
    growthRate: 0.74,
    mechanics: 0.7,
    densityBias: 0.8,
    hydrophobin: 0.25,
    laccase: 0.28,
    contaminationRisk: 0.76,
    preferred: ["sawdust", "hemp"],
    avoid: ["coffee"],
    erginNote:
      "Ergin Lab EL-CB-HE-02: ince hif, düşük dolgu. Yalıtım sınıfında aday; kirlenme payı yüksek, otoklav yazılır.",
  },
  {
    id: "lentinula-edodes",
    binomial: "Lentinula edodes",
    commonTr: "Shiitake",
    commonEn: "shiitake",
    cultureBook: "EL-CB-LE-04",
    tempOptC: 23,
    moistureOpt: 0.6,
    nominalDays: 18,
    growthRate: 0.72,
    mechanics: 1.08,
    densityBias: 1.08,
    hydrophobin: 0.38,
    laccase: 0.48,
    contaminationRisk: 0.7,
    preferred: ["sawdust", "hemp"],
    avoid: ["coffee", "rice"],
    erginNote:
      "Ergin Lab EL-CB-LE-04: talaş uzmanı. Homojen kabuk, yavaş. Orta yük ve ambalaj çekirdeği.",
  },
];

export const SUBSTRATES: Substrate[] = [
  {
    id: "straw",
    nameTr: "Buğday samanı",
    nameEn: "wheat straw",
    cn: 80,
    lignin: 0.18,
    hydrophilicity: 0.86,
    bulk: 0.9,
    cost: 0.4,
    carbon: 0.06,
    inherentMoisture: 0.12,
    particle: "Önce 2–4 cm, kolonizasyon homojenliği için 5–15 mm'ye kırpılır.",
  },
  {
    id: "sawdust",
    nameTr: "Sert ağaç talaşı",
    nameEn: "hardwood sawdust",
    cn: 200,
    lignin: 0.28,
    hydrophilicity: 0.55,
    bulk: 1.15,
    cost: 0.55,
    carbon: 0.08,
    inherentMoisture: 0.18,
    particle: "2–4 mm. İnce toz %15'i geçmesin; gaz alışverişini kapatır.",
  },
  {
    id: "coffee",
    nameTr: "Kahve posası",
    nameEn: "spent coffee grounds",
    cn: 21,
    lignin: 0.14,
    hydrophilicity: 0.7,
    bulk: 1.32,
    cost: 0.25,
    carbon: 0.04,
    inherentMoisture: 0.62,
    particle: "Olduğu gibi. Kuru pay %40 üzerinde tek başına kullanılmaz.",
  },
  {
    id: "hemp",
    nameTr: "Kenevir kıtığı",
    nameEn: "hemp hurd",
    cn: 50,
    lignin: 0.22,
    hydrophilicity: 0.8,
    bulk: 0.84,
    cost: 0.95,
    carbon: 0.07,
    inherentMoisture: 0.12,
    particle: "5–15 mm. Öz parçası uzun lif bırakır, yalıtımda işe yarar.",
  },
  {
    id: "rice",
    nameTr: "Pirinç kavuzu",
    nameEn: "rice husk",
    cn: 90,
    lignin: 0.2,
    hydrophilicity: 0.38,
    bulk: 0.7,
    cost: 0.35,
    carbon: 0.05,
    inherentMoisture: 0.1,
    particle: "Kırılmadan. Silika kabuk ısı iletkenliğini ve su tutmayı düşürür.",
  },
  {
    id: "corn",
    nameTr: "Mısır sapı",
    nameEn: "corn stover",
    cn: 60,
    lignin: 0.16,
    hydrophilicity: 0.76,
    bulk: 0.8,
    cost: 0.35,
    carbon: 0.06,
    inherentMoisture: 0.15,
    particle: "8–20 mm. Öz ve kabuk birlikte kalsın.",
  },
  {
    id: "cotton",
    nameTr: "Pamuk çırçır atığı",
    nameEn: "cotton gin waste",
    cn: 32,
    lignin: 0.08,
    hydrophilicity: 0.92,
    bulk: 0.74,
    cost: 0.5,
    carbon: 0.1,
    inherentMoisture: 0.08,
    particle: "Topakları aç. Çok ince linter ayrı tutulur.",
  },
  {
    id: "bagasse",
    nameTr: "Şeker kamışı küspesi",
    nameEn: "sugarcane bagasse",
    cn: 70,
    lignin: 0.2,
    hydrophilicity: 0.82,
    bulk: 0.88,
    cost: 0.4,
    carbon: 0.05,
    inherentMoisture: 0.22,
    particle: "10–25 mm. Artık şeker için pastörizasyon şart.",
  },
];

/** Target blend C:N after bran. Higher = leaner, less bacterial pull. */
export const INTENT_CN: Record<IntentId, number> = {
  "load-bearing": 40,
  insulation: 58,
  "water-retention": 44,
  "toxin-sorption": 72,
  lightweight: 62,
  packaging: 50,
  acoustic: 60,
  filtration: 68,
};

export const BRAND_CN = 17;

export function speciesById(id: string): Species {
  const found = SPECIES.find((s) => s.id === id);
  if (!found) throw new Error(`Ergin Lab katalogunda tür yok: ${id}`);
  return found;
}

export function substrateById(id: SubstrateId): Substrate {
  const found = SUBSTRATES.find((s) => s.id === id);
  if (!found) throw new Error(`Ergin Lab katalogunda substrat yok: ${id}`);
  return found;
}
