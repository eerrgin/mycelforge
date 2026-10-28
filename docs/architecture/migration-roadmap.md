# Güvenli mimari geçiş yol haritası

Bu plan büyük bir uygulamada regresyon riskini azaltmak için küçük, geri alınabilir adımlar önerir. Mevcut atölye dosyalarını topluca silip yeniden yazmak güvenli değildir.

## Faz 0 — Temel durum

1. Bir çalışma dalı açın; `main` üzerinde doğrudan geniş refactor yapmayın.
2. Mevcut komutları çalıştırın: typecheck, test, lint, mirror check, CLI check, Pages build.
3. Başarısız olanları ve ortam gereksinimlerini kaydedin.
4. Atölye route → bileşen → hook → alan motoru → depolama bağımlılık haritası çıkarın.
5. Mevcut API ve ekran davranışları için karakterizasyon testleri ekleyin.

**Çıkış ölçütü:** bilinen başlangıç durumu ve tekrarlanabilir test komutları.

## Faz 1 — Sözleşmeleri sabitle

- `src/lib/mycel/types.ts` kanonik alan sözleşmesi olarak kalır.
- UI ve CLI için aynı `src/lib/mycel/index.ts` public API'si kullanılır.
- Girdi doğrulaması tek yerde bulunur.
- Hata kodları, boş durumlar ve başarı sonuçları dokümante edilir.
- Örnek brief'ler otomatik testlere bağlanır.

**Çıkış ölçütü:** aynı girdinin web ve CLI tarafında aynı alan sonucu üretmesi.

## Faz 2 — Sınırları netleştir

- Route dosyalarını ince tut; veri alma/iş kuralı biriktirmesin.
- Atölyeye özel UI parçalarını feature alanında tut.
- Gerçekten paylaşılan UI parçalarını ortak bileşenlere taşı.
- Alan mantığını React bileşenlerinden ayır.
- Import kurallarını lint veya küçük bir mimari test ile denetle.

**Çıkış ölçütü:** alan motoru UI framework olmadan test edilebilsin.

## Faz 3 — Kopyaları azalt

Şu anda `src/lib/mycel/`, `src/components/mycel/`, `src/routes/` dosyalarının bir kısmı `mycelforge/` altında aynalanıyor ve kontrol betiği ile eşitlikleri doğrulanıyor.

Önerilen sıra:
1. İki tarafın tüketicilerini ve yayın gereksinimlerini belirle.
2. Tek kanonik kaynağı seç ve belgeye yaz.
3. Taşınabilir paketi kanonik kaynaklardan üreten bir build/copy komutu ekle.
4. CI'da “kaynak üretildi mi ve temiz çalışma ağacı var mı?” kontrolü yap.
5. Tüketicileri üretilen çıktıya geçir.
6. Eski elle düzenlenen kopyaları ancak tüm kontroller geçince kaldır.

Kopyaları hemen kaldırmak CLI veya statik yayın akışını kırabilir; önce üretim hattı kurulmalı.

## Faz 4 — Güvenlik ve bakım

- Gizli anahtar taraması ve `.env.example` (gerçek sırlar olmadan).
- Bağımlılık denetimi ve lockfile disiplini.
- CI: typecheck, test, lint, mirror/build kontrolü.
- Değişiklik şablonu ve küçük PR kuralı.
- Release notları ve model/şema sürümü.

## Faz 5 — Ölçüm ve kanıt

- Model katsayıları ile yazılım kurallarını ayrı dosyalarda tut.
- Her katsayı için kaynak, birim, veri aralığı ve sürüm kaydı ekle.
- Tahminleri laboratuvar ölçümüyle karıştırma.
- Bilimsel doğrulama yapılmadan model performansı iddia etme.

## Definition of Done

- [ ] İlgili testler ve typecheck geçiyor.
- [ ] Mimari sınırlar ihlal edilmiyor.
- [ ] Hata ve boş durumlar ele alınıyor.
- [ ] Belgeler ve örnekler güncel.
- [ ] Mirror/build kontrolü geçiyor.
- [ ] Atıf/lisans korunuyor.
- [ ] Değişiklik küçük, gözden geçirilebilir ve geri alınabilir.
