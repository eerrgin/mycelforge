# MycelForge

Miselyum biyo-malzeme **formül** ve **büyüme protokolü** motoru.

**Ergin Lab · Ergin Kaplan**  
İmza: `EL-MF-ERGIN-KAPLAN-2026`  
Model: `ergin-lab.mycelforge.model.v1`

Konuşan bir asistan değil. Kullanım amacını (yük, yalıtım, su tutma, toksin tutma, hafiflik, ambalaj, akustik, filtrasyon) ve elindeki tarımsal atığı alır; tür, karışım, nem, sıcaklık, süre, ısıl işlem ve adım adım laboratuvar protokolü üretir.

Bu bir **tarama modelidir**. Sertifika, izoterm veya ıslak ölçüm yerine geçmez. Her protokol bunu açıkça yazar.

---

## Ne yapar?

| Girdi | Çıktı |
| --- | --- |
| Amaç (yük / yalıtım / toksin…) | Tür seçimi (`Ganoderma`, `Trametes`…) |
| Atık listesi (saman, talaş, kahve…) | Kuru reçete + su + aşı |
| İklim, ölçek, pres, süre tavanı | İnkübasyon penceresi |
| (İsteğe bağlı) laboratuvar ölçümü | Model kaydırması + yeniden sıralama |

Her formülün kimliği `EL-MF-` ile başlar. Markdown ve JSON protokolde **Ergin Kaplan** ve **Ergin Lab** imzası vardır.

---

## Kurulum

Node.js **22+** gerekir. Komut satırı motoru ek runtime bağımlılığı istemez; web atölyesi için depo bağımlılıkları kullanılır.

```bash
git clone https://github.com/eerrgin/mycelforge.git
cd mycelforge
npm ci
npm run test:mycel
npm run forge
```

Web atölyesini `npm run build:pages` ile yerelde derleyebilirsin. CI, `npm test`, `npm run typecheck`, motor testlerini ve statik derlemeyi kontrol eder. Canlı sürüm [ana sitenin `/mycelforge/` adresinde](https://eerrgin.github.io/mycelforge/) yayınlanır; yayın akışı [ana site deposunda](https://github.com/eerrgin/eerrgin.github.io/tree/main/.github/workflows) bulunur. Çıktılar tarama tahminidir; üretim veya sertifikasyon kararı olarak değerlendirilmemelidir.

---

## Komut satırı

```bash
# Üç örnek brief özeti
npm run forge

# Tek protokol (Markdown)
npm run forge -- examples/yuk.json

# JSON çıktı
npm run forge -- examples/yalitim.json --json
```

Örnek brief (`examples/yalitim.json`):

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

### Alanlar

| Alan | Değerler |
| --- | --- |
| `intent` | `load-bearing` `insulation` `water-retention` `toxin-sorption` `lightweight` `packaging` `acoustic` `filtration` |
| `climate` | `temperate` `humid` `arid` `cold` |
| `substrates` | `straw` `sawdust` `coffee` `hemp` `rice` `corn` `cotton` `bagasse` |
| `priority` | `balanced` `strength` `speed` `cost` `carbon` |
| `scale` | `petri` (40 g) · `panel` (1,2 kg) · `pilot` (12 kg) |
| `press` | `auto` `off` `on` |
| `maxDays` | gün tavanı |

---

## Koddan kullanım

```ts
import { formulate, toMarkdown, parseLabImport } from "./src/lib/mycel/index.ts";

const { result, error } = formulate({
  intent: "load-bearing",
  climate: "temperate",
  substrates: ["sawdust", "hemp"],
  priority: "strength",
  scale: "panel",
  press: "on",
  maxDays: 21,
});

if (!result) throw new Error(error);
console.log(toMarkdown(result.primary));

// Laboratuvar ölçümü → modeli kaydır
const lab = parseLabImport(
  { compressiveMPa: 0.42, densityKgM3: 310, note: "Ergin Lab panel 3" },
  result.primary,
  new Date().toISOString(),
);
if (lab.ok) {
  const next = formulate(result.primary.brief, [lab.observation]);
}
```

---

## Klasör yapısı

```text
src/
├── components/mycel/         # Web atölyesi arayüzü
├── lib/mycel/                # Web atölyesinin formül motoru + defter durumu
└── pages-main.tsx            # GitHub Pages statik giriş noktası
mycelforge/
├── cli/forge.ts              # Komut satırı aracı
├── examples/                 # Örnek brief JSON dosyaları
├── src/lib/mycel/            # Taşınabilir motor paketi
└── studio/                   # Web bileşenlerinin taşınabilir eşleri
pages.html                    # Statik web derlemesinin HTML girişi
vite.config.pages.ts          # /mycelforge/ alt yolu için derleme ayarı
scripts/check-mycel-mirrors.mjs # Kopya kaynakların tutarlılık kontrolü
```

Web arayüzü kökteki `src/` dosyalarını kullanır. CLI paketi kendi başına da çalışabilsin diye motor ve sunum bileşenlerinin bir kopyasını `mycelforge/` altında tutarız; bu eş kopyalar `npm run check:mycel-mirrors` ile birebir karşılaştırılır. Canlı web sürümü ana sitenin `/mycelforge/` adresine yayınlanır.

### Nereyi değiştirirsin?

| İş | Dosya |
| --- | --- |
| Yeni tür / atık / kültür notu | `src/lib/mycel/catalog.ts` |
| Dayanım, yoğunluk, iletkenlik | `src/lib/mycel/model.ts` → `assess` |
| Amaç ağırlıkları | `src/lib/mycel/optimize.ts` |
| Protokol cümleleri | `src/lib/mycel/protocol.ts` |
| Markdown / JSON belge | `src/lib/mycel/markdown.ts` |

Gerçek bir regresyon veya ölçüm yüzeyi bağlamak için `assess` aynı çıktı şeklini koruyarak değiştirilir. Arama ve protokol yazarı yerinde kalır.

---

## Ne iddia etmez?

Katsayılar **Ergin Lab v1** çalışma değerleridir. Yayınlanmış miselyum kompozit bantlarının içine oturur (pressiz köpükler çoğu kaynakta düşük yoğunluk ve 1 MPa altı basma; sıcak pres sıkılaştırır). Saf miselyum filmlerinin yüksek gerilme sayıları bu kompozite taşınmaz. Sorpsiyon bir izoterm değil; tür seçmek için bir indekstir.

---

## Köken

MycelForge, **Ergin Kaplan** tarafından **Ergin Lab**'da kuruldu.

- İmza: `EL-MF-ERGIN-KAPLAN-2026`
- Ayrıntı: [`NOTICE`](./NOTICE)

İmzayı veya laboratuvar notlarını silmek kaynağı yanlış tanıtır.

---

## Mimari ve katkı rehberi

Atölye modülleri, veri sözleşmeleri, hata modeli, güvenli refactor sırası ve öğrenci sunum planı için [Ergin Atölye mimari rehberine](./docs/architecture/README.md) bakın.

Taşınabilir CLI/Studio kopyalarını kanonik uygulama kaynaklarından yeniden üretmek için `npm run sync:mycel-mirrors`, tutarlılığı doğrulamak için `npm run check:mycel-mirrors` çalıştırın. `src/` altındaki kanonik dosyaları düzenleyin; `mycelforge/` altındaki eş dosyaları elle değiştirmeyin.

## Lisans

[MIT](./LICENSE) — Copyright (c) 2026 Ergin Kaplan, Ergin Lab
