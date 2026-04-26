"use client";

import Button from "./Button";

type EvaluationSectionProps = {
  answered: number;
  distractions: number;
  elapsed: number;
  totalQuestions: number;
  totalFacts: number;
};

export default function EvaluationSection({
  answered,
  distractions,
  elapsed,
  totalQuestions,
  totalFacts,}: EvaluationSectionProps) {
  function scrollToLearning() {
    const el = document.getElementById("tipps");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  const results = [
    { label: "Beantwortete Fragen", value: answered + " / " + totalQuestions, accent: false },
    { label: "Benötigte Zeit", value: elapsed + "s", accent: false },
    { label: "Anzahl der Ablenkungen", value: distractions + " / " + totalFacts, accent: false },
    { label: "Angeklickte Fun Facts", value: distractions + " / " + totalFacts, accent: true },
  ];

  return (
    <section id="auswertung" className="border-t border-[#D9D2C3]">
      <div className="mx-auto max-w-7xl px-12 py-24">
        <div className="mb-6 font-mono text-[11px] uppercase tracking-widest text-[#6B6860]">
          Auswertung
        </div>
        <h2 className="font-serif text-6xl leading-tight tracking-tight">
          Deine <span className="italic text-[#D64D1E]">Auswertung</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#2A2A28]">
          Ein schlichtes Aufmerksamkeitsprofil, kein medizinischer Befund. Die Werte basieren ausschließlich auf deinem Verhalten in diesem Test.
        </p>

        <div className="mt-10 grid grid-cols-4 gap-px overflow-hidden rounded-2xl border border-[#D9D2C3] bg-[#D9D2C3]">
          {results.map((r, i) => (
            <div
              key={i}
              className={
                "flex min-h-[180px] flex-col justify-between gap-4 p-7 " +
                (r.accent ? "bg-[#0F0F0E] text-[#F5F1EA]" : "bg-[#F5F1EA]")
              }
            >
              <div
                className={
                  "font-mono text-[10px] uppercase tracking-widest " +
                  (r.accent ? "text-[#8C8A82]" : "text-[#6B6860]")
                }
              >
                {r.label}
              </div>
              <div
                className={
                  "font-serif text-6xl leading-none tracking-tight " +
                  (r.accent ? "text-[#D64D1E]" : "")
                }
              >
                {r.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-[1fr_auto] items-end gap-8 rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB] p-10">
          <div>
            <p className="font-serif text-2xl leading-snug tracking-tight">
              {answered === totalQuestions
                ? "Test abgeschlossen. Das ist dein aktuelles Aufmerksamkeitsbild."
                : "Starte zuerst den Test. Die Werte aktualisieren sich live."}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#6B6860]">
              Je weniger Fun Facts du anklickst, desto fokussierter warst du. Je mehr, desto stärker hat dich die Umgebung gezogen.
            </p>
          </div>
          <Button label="Erweitere dein Wissen" onClick={scrollToLearning} />
        </div>
      </div>
    </section>
  );
}
