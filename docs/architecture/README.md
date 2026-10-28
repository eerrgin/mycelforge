# Ergin Atölye — Mimari Rehberi

**Sahiplik/atıf:** Ergin Kaplan · Ergin Atölye / Ergin Lab  
**Kapsam:** MycelForge atölyesi ve onu taşıyan uygulama  
**Durum:** Mimari hedef ve güvenli geçiş rehberi — mevcut uygulamanın tamamının yeniden yazıldığı anlamına gelmez.

## Amaç

Atölye bölümlerini ortak bir sözleşmeye bağlamak; her modülün tek bir sorumluluğu olması; veri şekillerinin tutarlı kalması; UI, alan mantığı ve depolamanın birbirine karışmaması; tekrar eden işlevlerin ortak çözümlere taşınması.

## Mevcut depoda gözlenenler

- Uygulama React 19, TypeScript, Vite ve TanStack Router tabanlı.
- MycelForge alan motoru `src/lib/mycel/` altında; dışa açılan API `index.ts` üzerinden sunuluyor.
- Atölye bileşenleri `src/components/mycel/` altında.
- Taşınabilir CLI/Studio kopyaları `mycelforge/` altında tutuluyor.
- `scripts/check-mycel-mirrors.mjs` iki konumdaki dosyaların birebir aynı kalmasını denetliyor.
- Alan tipleri `DesignBrief`, `Formulation`, `ForgeResult` gibi ortak veri sözleşmeleri içeriyor.

Bu eş dosya düzeni şu an açık bir bakım maliyeti oluşturuyor: aynı mantığın iki kopyası değiştirildiğinde senkron kalmaları gerekiyor. Bu nedenle dosyaları bir anda silmek yerine, önce test ve CI güvencesiyle kontrollü geçiş yapılmalı.

## Hedef mimari

```text
src/app/                  uygulama kabuğu, sağlayıcılar, yönlendirme
src/routes/               sayfa/route bağlayıcıları; iş kuralı içermez
src/features/<feature>/   atölye ekranı, feature hooks ve UI adaptörleri
src/components/ui/        uygulama genelinde tekrar kullanılabilir görsel bileşenler
src/lib/<domain>/         framework bağımsız alan mantığı ve veri sözleşmeleri
src/lib/shared/           küçük, gerçekten ortak yardımcılar
src/platform/             dosya, veritabanı, tarayıcı ve ağ adaptörleri
tests/                    sözleşme, entegrasyon ve regresyon testleri
docs/architecture/        kararlar, sözleşmeler ve öğrenme materyali
```

Bu bir hedef yapıdır; her klasör hemen oluşturulmak zorunda değildir. Modül sınırı netleşmeden sırf klasör sayısını artırmayın.

## Temel kurallar

1. Route yalnızca ekranı bağlar; hesaplama yapmaz.
2. UI bileşeni alan kuralını yeniden yazmaz.
3. Alan motoru React, DOM, veritabanı veya ağ katmanına bağımlı olmaz.
4. Dışa açılan modül API'si tek giriş noktasından sunulur.
5. Modüller diğer modülün iç dosyalarını değil, public API'sini kullanır.
6. Başarı ve hata veri şekilleri açık ve tipli olur.
7. Paylaşılan kod ancak en az iki gerçek kullanım ve aynı anlam varsa ortaklaştırılır.
8. Aynı dosyanın elle düzenlenen iki kopyası kalıcı çözüm olarak kabul edilmez.
9. Kullanıcı verisi ve sırlar kaynak koduna yazılmaz.
10. Bilimsel model iddiaları deneysel kanıt olmadan kesin gerçek gibi sunulmaz.

## Belgeler

- [Modül sözleşmesi](./module-contract.md)
- [Veri ve hata modeli](./data-and-errors.md)
- [Geçiş yol haritası](./migration-roadmap.md)
- [Öğrenci atölyesi](./student-workshop.md)
- [Sahiplik ve güvenlik](./ownership-and-security.md)
- [Karar kaydı ADR-001](./adr-001-canonical-source.md)

## Kontrol komutları

Depo kökünde:

```bash
npm run typecheck
npm test
npm run lint
npm run check:mycel-mirrors
npm run check:forge-cli
npm run build:pages
```

Tüm komutların mevcut ortamda başarıyla çalıştığı bu doküman eklemesiyle iddia edilmemektedir. Değişiklik öncesi ve sonrası CI sonuçları kontrol edilmelidir.
