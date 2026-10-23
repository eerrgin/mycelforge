/**
 * MycelForge model notes
 * Copyright (c) 2026 Ergin Kaplan, Ergin Lab.
 * Provenance signature: EL-MF-ERGIN-KAPLAN-2026
 */

import { CALIBRATION } from "@/lib/mycel/model";
import { PROVENANCE } from "@/lib/mycel/provenance";

export function ModelPage() {
  return (
    <article className="max-w-3xl">
      <p className="text-sm text-accent">{PROVENANCE.signature}</p>
      <h1 className="mt-1 font-display text-4xl text-balance">Model</h1>
      <p className="mt-3 text-pretty text-muted">
        {PROVENANCE.statement} Sürüm {CALIBRATION.version}. Bu sayfa, katsayıların nereden geldiğini ve bir sonraki deneyde nereyi değiştireceğini yazar.
      </p>

      <h2 className="mt-8 font-display text-2xl">Ne hesaplanır</h2>
      <p className="mt-2 text-pretty text-sm leading-relaxed">
        Motor, seçilen amaç için tür × atık karışımı × nem × süre × pres ızgarasını tarar. Her adayda kolonizasyon, yoğunluk, basma, eğilme, ısı iletkenliği, su tutma, sorpsiyon indeksi ve kaba bir karbon-maliyet taraması çıkar. En yüksek skor protokole dökülür. Sayılar yayınlanmış miselyum kompozit bantlarının içinde duran Ergin Lab v1 katsayılarıdır. Sertifika, izoterm veya çekme deneyi değildir.
      </p>

      <h2 className="mt-8 font-display text-2xl">Dayanak</h2>
      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-pretty">
        <li>Yoğunluk-dayanım ilişkisi hücresel katılar ölçeğinde kuruldu: dayanım, yoğunlukla doğrusal artmaz.</li>
        <li>Pressiz köpükler çoğu kaynakta kabaca 60–180 kg/m³ ve 1 MPa altı basmada kalır. Sıcak pres paneli sıkılaştırır.</li>
        <li>Saf miselyum filmlerinin yüksek gerilme sayıları bu kompozit modele taşınmaz. Ürün sınıfı ayrıdır.</li>
        <li>Lakkaz ve hidrofobin eksenleri tür seçmek içindir. Enzim ünitesi veya temas açısı iddiası yoktur.</li>
      </ul>

      <h2 className="mt-8 font-display text-2xl">Ölçüm nasıl geri besler</h2>
      <p className="mt-2 text-sm text-pretty leading-relaxed">
        Laboratuvar JSON'u, o anki tahminle ölçümü oranlar. Oran, az sayıda ölçümde bire doğru çekilir; tek gürültülü parti modeli devirmez. Sanal büyüme turu aynı kapıdan girer ama ağırlığı düşüktür ve ıslak veri diye işaretlenmez. Yeni ölçüm, bir sonraki taramada tüm adayların tahminini kaydırır.
      </p>

      <h2 className="mt-8 font-display text-2xl">Nereyi açarsın</h2>
      <ul className="mt-2 space-y-2 text-sm">
        <li><span className="text-muted">Yeni tür veya atık: </span>katalog, kültür defteri kimliğiyle.</li>
        <li><span className="text-muted">Katsayı: </span>model dosyasındaki Ergin Lab kalibrasyonu. Burası değiştirilecek dikiş.</li>
        <li><span className="text-muted">Amaç ağırlığı: </span>arama dosyasındaki skor tablosu.</li>
        <li><span className="text-muted">Protokol cümlesi: </span>adım yazarı. Yeni bir kontrol satırı oraya eklenir.</li>
        <li><span className="text-muted">Gerçek regresyon: </span>assess fonksiyonunu aynı çıktıyı verecek bir eğriyle değiştir. Arayüz ve protokol yerinde kalır.</li>
      </ul>

      <h2 className="mt-8 font-display text-2xl">Depo adı</h2>
      <p className="mt-2 text-sm text-pretty">
        GitHub deposunun adı <strong>mycelforge</strong> olsun. Açıklama satırı: “MycelForge — Ergin Lab mycelium biomaterial formulation engine.” Kullanıcı adın durur; laboratuvar adını depo adına gömmeye gerek yok, imza zaten her protokoldedir.
      </p>

      <p className="mt-8 border-t border-line pt-4 text-sm text-muted">
        {PROVENANCE.laboratory} · {PROVENANCE.principal} · {PROVENANCE.origin}
      </p>
    </article>
  );
}
