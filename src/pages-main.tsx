import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Studio } from "@/components/mycel/studio";
import { useForge } from "@/lib/mycel/store";
import "@/styles.css";

function MycelForgePages() {
  useEffect(() => {
    void useForge.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <a href="https://eerrgin.github.io/ergin-lab/" className="flex min-h-11 items-center gap-3 rounded-lg" aria-label="Ergin Lab ana sayfasına dön">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-display text-lg text-primary-fg" aria-hidden="true">MF</span>
            <span>
              <span className="block font-display text-2xl leading-none tracking-tight">MycelForge</span>
              <span className="mt-1 block text-xs text-muted">Ergin Lab · Ergin Kaplan</span>
            </span>
          </a>
          <nav className="flex flex-wrap items-center gap-2 text-sm" aria-label="Dış bağlantılar">
            <a className="inline-flex min-h-11 items-center rounded-lg px-3 text-muted hover:bg-bg hover:text-ink" href="https://eerrgin.github.io/ergin-lab/">Ergin Lab</a>
            <a className="inline-flex min-h-11 items-center rounded-lg border border-line px-3 text-ink hover:bg-bg" href="https://github.com/eerrgin/mycelforge" rel="noopener noreferrer">Kaynak kod ↗</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-7 sm:py-10">
        <section className="mb-7 max-w-3xl">
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-primary">BİYOMALZEME TARAMA ATÖLYESİ · EL-MF-ERGIN-KAPLAN-2026</p>
          <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">Miselyumdan <em>malzemeye.</em></h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">Kullanım amacını ve elindeki tarımsal atıkları seç. Motor, karşılaştırılabilir formül adayları ile deney protokolünü hazırlar.</p>
          <p className="mt-4 rounded-lg border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted">Önemli: Çıktılar tarama modeli tahminleridir. Laboratuvar ölçümü, güvenlik değerlendirmesi, sertifika veya gerçek malzeme performansı yerine geçmez. Üretim kararından önce kontrollü deney ve ölçüm gerekir.</p>
        </section>
        <Studio />
        <section className="mt-8 rounded-lg border border-line bg-surface p-4 text-sm leading-relaxed text-muted sm:p-5">
          <h2 className="font-display text-xl text-ink">Veri ve model notu</h2>
          <p className="mt-2">Formül defteri bu tarayıcının yerel depolamasında tutulur. Bu statik sayfa bir laboratuvar sunucusuna ölçüm göndermez. Tahmini değerler kalibrasyon ve gerçek numune testleriyle doğrulanmalıdır.</p>
          <p className="mt-3 text-xs">Ergin Lab · Ergin Kaplan · EL-MF-ERGIN-KAPLAN-2026</p>
        </section>
      </main>
      <footer className="border-t border-line px-4 py-6 text-center text-xs text-muted">MycelForge · Ergin Lab · <a className="underline underline-offset-4" href="https://github.com/eerrgin/mycelforge">Açık kaynak</a></footer>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("MycelForge root element was not found.");
createRoot(rootElement).render(<MycelForgePages />);
