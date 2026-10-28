# ADR-001: Alan mantığı için kanonik kaynak

- **Durum:** Önerildi
- **Tarih:** 2026-10-28
- **Sahip:** Ergin Atölye / Ergin Kaplan

## Bağlam

MycelForge alan kodunun bir bölümü uygulama kaynaklarında ve ayrıca taşınabilir `mycelforge/` dizininde bulunuyor. `scripts/check-mycel-mirrors.mjs` eş dosyaların birebir aynı olmasını kontrol ediyor. Bu, sapmaları yakalasa da kopya kaynakların elle senkron tutulması gereksinimini ortadan kaldırmıyor.

## Karar

Şimdilik mevcut üretim akışı ve testler korunacak. Geçiş hazırlığında `src/lib/mycel/` ve uygulama kaynakları kanonik kaynak olarak değerlendirilecek; `mycelforge/` altındaki taşınabilir çıktıların otomatik üretilebilmesi araştırılacak. Eski kopyalar, tüketiciler taşınmadan ve CI kanıtı alınmadan silinmeyecek.

## Sonuçlar

**Olumlu**
- Tek kaynak hedefi ve sahiplik netleşir.
- Kopya dosyalar arasındaki insan kaynaklı farklar azalır.
- Web ve CLI aynı alan davranışını paylaşabilir.

**Maliyet / risk**
- CLI'nin bağımsız paketleme gereksinimi korunmalıdır.
- Build betiği kaynak haritasını doğru izlemelidir.
- Yol alias'ları ve TypeScript çalışma zamanı uyumluluğu doğrulanmalıdır.

## Doğrulama

- Mirror kontrolü veya onun yerine geçen üretim kontrolü CI'da çalışmalı.
- `npm run typecheck`, `npm test`, `npm run test:mycel`, `npm run check:mycel-mirrors`, `npm run check:forge-cli` ve ilgili build komutları geçmeli.
- Web ve CLI için aynı örnek girdinin alan sonucu karşılaştırılmalı.
