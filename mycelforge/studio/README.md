# Atölye kaynakları

Bu klasör, MycelForge atölyesinin arayüz dosyalarıdır. Motor `src/lib/mycel` altındadır ve tek başına çalışır.

Arayüz dosyaları bir web kabuğuna bağlıdır (`zustand` defteri, yönlendirici). GitHub'da motoru geliştirmek için önce `catalog.ts`, `model.ts`, `optimize.ts` ve `protocol.ts` yeter. Arayüz aynı fonksiyonları çağırır: `formulate`, `parseLabImport`, `simulateBatch`, `toMarkdown`.
