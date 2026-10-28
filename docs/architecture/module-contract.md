# Modül sözleşmesi

## Bir modül neyi içermeli?

Bir özellik modülü kendi ekranını ve kullanıcı etkileşimini yönetir; alan kararlarını ise `src/lib/<domain>/` üzerinden çağırır.

Önerilen örnek:

```text
src/features/mycel-studio/
  index.ts             # public API
  MycelStudioPage.tsx  # sayfa bileşimi
  components/          # yalnızca bu özelliğe ait parçalar
  hooks/               # UI durumu / orkestrasyon
  adapters/            # alan sonucunu görünüm modeline dönüştürme
src/lib/mycel/
  index.ts             # alan motorunun public API'si
  types.ts             # kanonik veri sözleşmeleri
  optimize.ts          # seçim/arama algoritması
  model.ts             # değerlendirme
  protocol.ts          # protokol üretimi
```

Bu örnek doğrudan taşıma talimatı değildir; önce bağımlılık haritası ve testler çıkarılmalıdır.

## İzin verilen bağımlılık yönü

```text
route → feature UI → domain public API
                       ↑
                platform adapters
```

- Alan motoru, feature UI'ını import etmez.
- Bir feature başka bir feature'ın iç dosyasını import etmez.
- Paylaşılan UI, MycelForge alan tiplerini bilmek zorunda değildir.
- Platform adaptörleri, domain modeline bağımlı olabilir; domain modeli platform adaptörünü import etmez.

## Public API

`src/lib/mycel/index.ts` mevcut dışa açılan alan API'sidir. Yeni dış tüketiciler için buradan dışa aktarmak tercih edilir; derin iç yollar (`.../optimize.ts` gibi) dış sözleşme sayılmamalıdır.

Public API değişikliklerinde:
- tür/alan kaldırma veya anlam değiştirme açıkça belgelenir;
- örnek brief'ler güncellenir;
- CLI, web arayüzü ve taşınabilir paket test edilir;
- varsa mirror kontrolü çalıştırılır.

## Ortak bileşen kararı

Bir bileşen ancak farklı bölümlerde aynı görsel/etkileşim sorumluluğunu taşıyorsa `src/components/ui/` içine alınır. Tek bir atölyeye özgü bileşen feature içinde kalır. Sırf iki dosya benziyor diye ortaklaştırmayın; varyant ve erişilebilirlik davranışı da aynı olmalı.

## Kod inceleme kontrol listesi

- [ ] Yeni kod doğru katmanda mı?
- [ ] Var olan alan tipini tekrar tanımlıyor mu?
- [ ] Import, modül sınırını aşıyor mu?
- [ ] Aynı işlev başka yerde zaten var mı?
- [ ] Hatalar açık ve kullanıcıya güvenli mi?
- [ ] Birim testi ve ilgili entegrasyon testi var mı?
- [ ] CLI / web / taşınabilir kopyalar etkileniyor mu?
- [ ] Kaynak ve model iddiaları doğru etiketlendi mi?
