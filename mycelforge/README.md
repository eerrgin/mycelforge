# MycelForge

Miselyum biyo-malzeme formül ve büyüme protokolü motoru.

**Ergin Lab · Ergin Kaplan**
İmza: `EL-MF-ERGIN-KAPLAN-2026`
Model: `ergin-lab.mycelforge.model.v1`

Konuşan bir asistan değil. Kullanım amacını (yük, yalıtım, su tutma, toksin tutma, hafiflik, ambalaj, akustik, filtrasyon) ve elindeki tarımsal atığı alır; tür, karışım, nem, sıcaklık, süre, ısıl işlem ve adım adım laboratuvar protokolü üretir.

Bu bir tarama modelidir. Sertifika, izoterm veya ıslak ölçüm yerine geçmez. Her protokol bunu açıkça yazar.

## Depo adı

GitHub deposunun adı:

```text
mycelforge
```

Açıklama:

```text
MycelForge — Ergin Lab mycelium biomaterial formulation and growth-protocol engine.
```

Laboratuvar adı depo adresinde olmak zorunda değil. Her protokol kimliği `EL-MF-` ile başlar, her belgede Ergin Kaplan ve Ergin Lab yazar. İmzayı silmek kaynağı yanlış tanıtır.

## Çalıştır

Node 22 gerekir. Bağımlılık yok.

```bash
npm test
npm run forge
npm run forge -- examples/yuk.json
npm run forge -- examples/yalitim.json --json
```

`npm run forge` üç örnek brief'in özetini basar. Bir JSON dosyası verilirse protokolü Markdown yazar.

## Brief

```json
{
  "intent": "insulation",
  "climate": "temperate",
  "substrates": ["straw", "hemp", "sawdust"],
  "priority": "balanced",
  "scale": "panel",
  "press": "auto",
  "maxDays": 16
}
```

- `intent`: `load-bearing` `insulation` `water-retention` `toxin-sorption` `lightweight` `packaging` `acoustic` `filtration`
- `climate`: `temperate` `humid` `arid` `cold`
- `substrates`: `straw` `sawdust` `coffee` `hemp` `rice` `corn` `cotton` `bagasse`
- `priority`: `balanced` `strength` `speed` `cost` `carbon`
- `scale`: `petri` (40 g kuru) `panel` (1,2 kg) `pilot` (12 kg)
- `press`: `auto` `off` `on`
- `maxDays`: gün tavanı

## Ölçüm geri beslemesi

```ts
import { formulate, parseLabImport } from "./src/lib/mycel/index.ts";

const first = formulate(brief).result!;
const lab = parseLabImport(
  { compressiveMPa: 0.42, densityKgM3: 310, note: "Ergin Lab panel 3" },
  first.primary,
  new Date().toISOString(),
);
if (lab.ok) {
  const next = formulate(brief, [lab.observation]);
}
```

Az sayıda ölçüm bire doğru çekilir. Tek gürültülü parti modeli devirmez. `simulateBatch` ıslak veri değildir; hata bandından bir çekiliştir.

## Nereyi değiştirirsin

| İş | Dosya |
| --- | --- |
| Yeni tür, atık, kültür defteri notu | `src/lib/mycel/catalog.ts` |
| Katsayılar, yoğunluk, dayanım, iletkenlik | `src/lib/mycel/model.ts` içindeki `assess` |
| Amaç ağırlıkları | `src/lib/mycel/optimize.ts` |
| Protokol cümleleri ve reçete | `src/lib/mycel/protocol.ts` |
| Markdown / JSON belge | `src/lib/mycel/markdown.ts` |

Gerçek bir regresyon veya ölçüm yüzeyi bağlamak için `assess` aynı çıktıyı verecek şekilde değiştirilir. Arama, protokol ve belge yerinde kalır.

## Ne iddia etmez

Katsayılar Ergin Lab v1 çalışma değerleridir. Yayınlanmış miselyum kompozit bantlarının içine oturur (pressiz köpükler çoğu kaynakta düşük yoğunluk ve 1 MPa altı basma; sıcak pres sıkılaştırır). Saf miselyum filmlerinin yüksek gerilme sayıları bu kompozite taşınmaz. Sorpsiyon bir izoterm değil, tür seçmek için bir indekstir.

## Köken

MycelForge, Ergin Kaplan tarafından Ergin Lab'da kuruldu. Ayrıntı `NOTICE` dosyasında.
