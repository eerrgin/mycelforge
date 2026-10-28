# Sahiplik, atıf ve kod güvenliği

## İsim koymak tek başına koruma değildir

Dosyalara “Ergin Kaplan” yazmak kaynak atfını görünür kılar; kodun kopyalanmasını teknik olarak engellemez. GitHub'da kamuya açık bir depoyu görüntülemek ve kopyalamak mümkündür. Koruma için görünür atıfı lisans, sürüm geçmişi, erişim politikası ve gerektiğinde hukuki danışmanlıkla birlikte düşünün.

## Bu depo için pratik adımlar

1. Her özgün modülde doğru telif/atıf başlığı kullanın; üçüncü taraf koduna kendi telifinizi yazmayın.
2. Kök `LICENSE` dosyasının gerçekte hangi hakları verdiğini anlayın. MIT gibi açık lisanslar yeniden kullanıma geniş izin verir; “çalınmasın” hedefiyle çelişebilir.
3. Yeniden kullanım istemediğiniz kodu yayımlamadan önce depo görünürlüğünü ve lisansı bilinçli seçin. Private depo da yetkili işbirlikçiler ve hesap güvenliği risklerini tamamen ortadan kaldırmaz.
4. Gizli anahtar, token, kişisel veri, özel laboratuvar kaydı veya erişim bilgisi commit etmeyin. Sır yanlışlıkla eklendiyse yalnızca dosyayı silmek yeterli olmayabilir; anahtarı iptal edip geçmişi de değerlendirin.
5. Git commit geçmişini koruyun; anlamlı commit mesajları ve etiketli sürümler kullanın.
6. Üçüncü taraf paketlerin lisanslarını ve görsel/veri kaynaklarını belgeleyin.
7. Sahiplik imzasını sonuç dosyalarına eklemek köken takibini kolaylaştırır, fakat kriptografik imza veya hukuki koruma yerine geçmez.

## Önerilen atıf metni

```text
MycelForge / Ergin Atölye
Origin and project stewardship: Ergin Kaplan
Repository: https://github.com/eerrgin/mycelforge
```

Metni yalnızca gerçekten size ait olan çalışma ve dosyalarda kullanın. Katkı verenlerin emeğini ve üçüncü taraf lisanslarını koruyun.

## Önemli sınır

Bu belge hukuki danışmanlık değildir. Ticari koruma veya lisans seçimi önemliyse, yayımlamadan önce uygun bir hukuk uzmanıyla görüşün.
