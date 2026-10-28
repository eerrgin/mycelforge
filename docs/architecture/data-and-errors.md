# Tutarlı veri yapıları ve hata modeli

## Kanonik veri sözleşmeleri

MycelForge alanında mevcut temel sözleşmeler `src/lib/mycel/types.ts` içinde tanımlıdır. Önemli örnekler:

- `DesignBrief`: kullanıcının hedef ve kısıtlarını taşır.
- `Formulation`: üretilen formül, tür, karışım, tahminler ve adımları taşır.
- `ForgeResult`: ana sonuç, alternatifler, değerlendirilen aday sayısı ve bias bilgisi.
- `Observation`: ölçümün kaynağını, zamanını ve karşılaştırma referansını taşır.
- `SavedRun`: kaydedilen çalışmayı ve gözlemleri bağlar.

Yeni bir ekranda bu nesneleri yeniden tanımlamayın. UI'a özel biçim gerekiyorsa ayrı bir view-model/adaptör kullanın ve alan modelini bozmayın.

## Genel sonuç sözleşmesi

Yeni asenkron servisler için sonuçları istisna metinlerini ayrıştırarak yönetmek yerine ayrık türlerle ifade edin. Örnek tasarım:

```ts
type AppError = {
  code: string;
  message: string;
  retryable: boolean;
};

type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: AppError };
```

Bu, önerilen sözleşme örneğidir; mevcut fonksiyonların hepsini aynı anda bu tipe dönüştürmek için gerekçe değildir. Var olan API'yi değiştirirken çağıranları ve testleri birlikte güncelleyin.

## Hata sınıfları

1. **Validation:** kullanıcı girdisi kurala uymuyor; alan ve düzeltme ipucu ver.
2. **Not found:** kaynak yok; güvenli bir boş durum göster.
3. **Permission:** yetki yok; hassas ayrıntı sızdırma.
4. **Conflict:** aynı kayıt farklı bir sürümle değişmiş; yenileme/uzlaştırma iste.
5. **Network / storage:** geçici hata olabilir; yeniden deneme politikasını açık belirle.
6. **Unexpected:** izlenebilir bir olay kimliği göster; ham stack trace'i kullanıcıya verme.

Hata kodları kararlı olmalı; arayüz, insan tarafından okunabilir metni hata mesajını parçalayarak çıkarmamalıdır.

## Veri ilkeleri

- JSON ve form girdilerini güvenilmeyen veri olarak ele alın.
- Sayısal değerlerde `NaN`, `Infinity`, yanlış birimler ve aralıkları kontrol edin.
- Zaman damgaları için ISO 8601 gibi açık bir biçim kullanın.
- Kimlik, kullanıcı tarafından görülen etiket ve makine enum'unu birbirine karıştırmayın.
- API/kalıcı veri değişikliklerinde şema sürümlemesi ve geriye uyumluluk planı yazın.
- Bilimsel tahminleri ölçümden ayırın; tahmin, gözlem ve kalibrasyon aynı alanmış gibi gösterilmemelidir.
