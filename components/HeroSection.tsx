"use client";

import Button from "./Button";

export default function HeroSection() {
  function scrollToTest() {
    const el = document.getElementById("test");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="home"
      className="relative min-h-[85vh] border-b border-[#D9D2C3]"
      style={{
        backgroundImage: "url('/images/hero.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#F5F1EA]/90 via-[#F5F1EA]/60 to-transparent" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-12 py-16">
        <div className="flex flex-wrap justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-[#6B6860]">
          <span>Digitale Ablenkung und bewusster Umgang mit dem Smartphone</span>
          <span>Band 01 - Fokus im Zeitalter der Ablenkung</span>
        </div>

        <div className="mt-16 max-w-2xl">
          <h1 className="font-serif text-[6.5rem] leading-[0.98] tracking-tight">
            Die <span className="italic text-[#D64D1E]">Aufmerksamkeit</span> ist die wichtigste Ressource des Internets.
          </h1>

          <p className="mt-10 max-w-xl text-lg leading-relaxed text-[#2A2A28]">
            Social Media, Dark Patterns, Dauer-Scrolling <br />
            Sie alle wollen dasselbe: deine Zeit und deinen Fokus. Wie gut kannst du dich heute noch konzentrieren?
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-8">
            <Button label="Jetzt loslegen" onClick={scrollToTest} />
          </div>
        </div>
      </div>
    </section>
  );
}
