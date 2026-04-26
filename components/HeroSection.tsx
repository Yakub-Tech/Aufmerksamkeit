"use client";

import Button from "./Button";

export default function HeroSection() {
  function scrollToTest() {
    const el = document.getElementById("test");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="home" className="border-b border-[#D9D2C3]">
      <div className="mx-auto max-w-7xl px-12 pt-16 pb-28">
        <div className="flex flex-wrap justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-[#6B6860]">
          <span>Digitale Ablenkung und bewusster Umgang mit dem Smartphone</span>
          <span>Band 01 - Fokus im Zeitalter der Ablenkung</span>
        </div>

        <div className="mt-16 grid grid-cols-[1.4fr_1fr] items-center gap-10">
          <div>
            <h1 className="font-serif text-[6.5rem] leading-[0.98] tracking-tight">
              Die <span className="italic text-[#D64D1E]">Aufmerksamkeit</span> ist die wichtigste Ressource des Internets.
            </h1>

            <p className="mt-10 max-w-xl text-lg leading-relaxed text-[#2A2A28]">
              Social Media, Dark Patterns, Dauer-Scrolling <br></br> Sie alle wollen dasselbe: deine Zeit und deinen Fokus. Wie gut kannst du dich heute noch konzentrieren?
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-8">
              <Button label="Jetzt loslegen" onClick={scrollToTest} />
              <div className="font-mono text-[11px] uppercase leading-relaxed tracking-widest text-[#6B6860]">
                Dauer ca. 3 Min<br />
                8 mögliche Ablenkungen<br />
                4 Fragen
              </div>
            </div>
          </div>

          <div className="relative aspect-square w-full max-w-md justify-self-end overflow-hidden rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB]">
            <div className="absolute left-5 top-5 border border-[#0F0F0E] bg-[#F5F1EA] px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-[#0F0F0E]">
              text
            </div>
            <div className="absolute right-5 top-5 bg-[#D64D1E] px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-[#F5F1EA]">
              follow
            </div>
            <div className="absolute bottom-5 left-5 bg-[#0F0F0E] px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-[#F5F1EA]">
              action
            </div>
            <div className="absolute bottom-5 right-5 border border-[#0F0F0E] bg-[#F5F1EA] px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-[#0F0F0E]">
              text
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span >
                Abbildung hier
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
