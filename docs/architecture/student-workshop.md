# Öğrenciler için uygulamalı mimari dersi

## Dersin hedefi

Öğrenci, bir uygulamayı “çalışan kod” seviyesinden bakımı yapılabilir modüllere ayırmayı; ortak veri sözleşmesi, test, hata modeli ve mimari karar kaydı kullanmayı öğrenir.

## 60–90 dakikalık plan

### 1. Sistemi okuyun (10 dk)
- `src/routes/` içinden bir route seçin.
- Route'un çağırdığı atölye bileşenini bulun.
- Alan mantığının `src/lib/mycel/` içindeki giriş noktasını takip edin.
- Akışı kutular ve oklarla çizin.

### 2. Sözleşmeyi bulun (10 dk)
`DesignBrief` ve `ForgeResult` tiplerini okuyun. Hangi alanlar kullanıcı girdisi, hangileri hesaplanan çıktı? Neden aynı tipin ikinci kopyasını tanımlamamalıyız?

### 3. Hata senaryosu tasarlayın (15 dk)
Örnek: boş substrat listesi, geçersiz `maxDays`, dosya/ölçüm içe aktarma hatası. Beklenen hata kodunu ve kullanıcıya gösterilecek mesajı yazın. Geçersiz veriyle tahmin üretmeyin.

### 4. Test ekleyin (15 dk)
Önce beklenen davranışı tanımlayan bir test yazın, sonra en küçük kod değişikliğini yapın. Normal durumun yanında en az bir sınır ve bir hata durumu test edin.

### 5. Tekrarı değerlendirin (10 dk)
İki bileşenin benzer kodunu görünce doğrudan ortaklaştırmayın. Aynı davranış ve aynı değişim nedeni var mı? Ortaklaştırmanın API'si daha basit mi?

### 6. Sunum (10–20 dk)
Öğrenci şu beş soruyu cevaplasın:
1. Veri nereden geliyor?
2. Hangi katman karar veriyor?
3. Hata nerede ve nasıl yakalanıyor?
4. Hangi test güvence veriyor?
5. Bu tasarımın maliyeti ve alternatifi nedir?

## Değerlendirme rubriği

| Ölçüt | Puan |
|---|---:|
| Veri akışını doğru anlatma | 20 |
| Modül sınırına uyma | 20 |
| Tutarlı veri ve hata sözleşmesi | 20 |
| Anlamlı test ve sınır durumları | 20 |
| Teknik kararı ve ödünleşimi açıklama | 20 |

## Öğretmen notu

AI destekli kod kullanımı yasak veya gizli olmak zorunda değildir; ancak öğrenci üretilen kodu açıklamalı, test etmeli ve sınırlamalarını belirtmelidir. “Kod yazıldı” ile “doğruluğu gösterildi” aynı şey değildir. MycelForge içindeki bilimsel model varsayımları da ayrıca kanıtlanmalıdır.
