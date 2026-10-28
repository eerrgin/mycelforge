# Ergin Kaplan — Resilience Lab

Küçük ve incelenebilir hata yönetimi örnekleri. Amaç, yalnızca normal koşullarda çalışan kod yazmak değil; bozuk veri, çevrimdışı kullanım ve tarayıcı kısıtları karşısında kontrollü davranışı test etmektir.

- **Guardrail:** JSON sınırları, veri doğrulama ve güvenli hata mesajları.
- **Offline Queue:** çevrimdışı kuyruk ve sınırlandırılmış yeniden deneme.
- **Browser Probe:** tarayıcı özelliklerini kullanıcı aracısı metnine güvenmeden sınama.

## Çalıştırma

Node.js 20+ gerekir. Harici çalışma zamanı bağımlılığı yoktur.

```bash
cd resilience-lab
npm test
```

## İlkeler

- Güvenilmeyen girdiyi sınırda doğrula.
- Geçersiz veriyi sessizce düzeltme; anlaşılır hata döndür.
- Ham hata izlerini ve sırları kullanıcıya gösterme.
- Yeniden denemeleri ve kuyruk boyutunu sınırla.
- Tarayıcı API'lerini varsayma; özellikleri kontrol et.
- Test edilmemiş senaryoları başarılı diye tanıtma.

Bunlar öğrenme ve mühendislik örnekleridir; kapsamlı güvenlik incelemesinin veya gerçek tarayıcı uçtan uca testlerinin yerini tutmaz. Kuyruk bellekte çalışır; yeniden başlatma sonrası kalıcılık ya da dağıtık sistemlerde tam bir kez teslim garantisi vermez.

Ergin Kaplan'ın MycelForge deposundaki test ve hata yönetimi çalışmasıdır. Bu klasör için de deponun kök lisansı geçerlidir.
