"use client";

import Button from "./Button";

// Simulierte Durchschnittswerte anderer Nutzerinnen und Nutzer
// Können später durch echte Werte aus der Datenbank ersetzt werden
const AVG_TIME_SECONDS = 45;
const AVG_DISTRACTIONS = 4;

type EvaluationSectionProps = {
  answered: number;
  distractions: number;
  elapsed: number;
  totalQuestions: number;
  totalFacts: number;
};

function hi(text: string | number) {
  return <span className="italic text-[#D64D1E]">{text}</span>;
}

function getEvalMain(distractions: number, elapsed: number, totalFacts: number) {
  const isHighDistractions = distractions > AVG_DISTRACTIONS;
  const isLowTime = elapsed < AVG_TIME_SECONDS - 10;
  const isHighTime = elapsed > AVG_TIME_SECONDS + 15;

  if (distractions === 0) {
    return (
      <>
        Du hast während des Quiz keinen einzigen Fun Fact angeklickt. Das
        spricht dafür, dass du deine Aufmerksamkeit sehr gut bei der
        eigentlichen Aufgabe halten konntest.
      </>
    );
  }
  if (distractions <= 2 && !isHighTime) {
    return (
      <>
        Du hast während des Quiz nur {hi(`${distractions} von ${totalFacts}`)}{" "}
        Fun Facts angeklickt. Das spricht dafür, dass du deine Aufmerksamkeit
        vergleichsweise gut bei der eigentlichen Aufgabe halten konntest.
      </>
    );
  }
  if (isHighDistractions && isLowTime) {
    return (
      <>
        Du warst zügig unterwegs, hast dich aber {hi(`${distractions}-mal`)}{" "}
        ablenken lassen. Ein gemischtes Bild: gutes Tempo, aber die Umgebung
        hat öfter gezogen.
      </>
    );
  }
  if (distractions <= 2 && isHighTime) {
    return (
      <>
        Du hast kaum Ablenkungen angeklickt, hast dir aber mehr Zeit gelassen
        als der Durchschnitt. Eine konzentrierte, bedächtige Herangehensweise.
      </>
    );
  }
  if (isHighDistractions) {
    return (
      <>
        Du hast {hi(`${distractions} von ${totalFacts}`)} Fun Facts angeklickt.
        Die Umgebung hat dich öfter abgelenkt als im Durchschnitt.
      </>
    );
  }
  if (isHighTime) {
    return (
      <>
        Du hast dir mehr Zeit gelassen als der Durchschnitt. Das kann auf eine
        bedächtigere, konzentriertere Vorgehensweise hinweisen.
      </>
    );
  }
  return (
    <>
      Du hast während des Quiz {hi(`${distractions} von ${totalFacts}`)}{" "}
      Fun Facts angeklickt.
    </>
  );
}

function getEvalSub(distractions: number, elapsed: number) {
  const timeDiff = AVG_TIME_SECONDS - elapsed;

  const distCompare =
    distractions < AVG_DISTRACTIONS
      ? "das ist unter dem Durchschnitt. Ein gutes Zeichen."
      : distractions > AVG_DISTRACTIONS
      ? "das liegt über dem Durchschnitt."
      : "das entspricht dem Durchschnitt.";

  const timeNote =
    timeDiff > 5 ? (
      <> Du warst {hi(`${timeDiff} Sekunden`)} schneller als der Durchschnitt.</>
    ) : timeDiff < -5 ? (
      <> Du hast {hi(`${Math.abs(timeDiff)} Sekunden`)} länger gebraucht als der Durchschnitt.</>
    ) : null;

  return (
    <>
      Deine Aufmerksamkeit wurde {hi(`${distractions}-mal`)} unterbrochen,{" "}
      {distCompare}
      {timeNote}
    </>
  );
}

export default function EvaluationSection({
  answered,
  distractions,
  elapsed,
  totalQuestions,
  totalFacts,
}: EvaluationSectionProps) {
  function scrollToStatistics() {
    const el = document.getElementById("statistiken");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  const isTestDone = answered === totalQuestions;

  const comparisonLabel = !isTestDone
    ? "—"
    : distractions < AVG_DISTRACTIONS
    ? "unter Ø"
    : distractions > AVG_DISTRACTIONS
    ? "über Ø"
    : "~ Ø";

  const stats = [
    { label: "Anzahl der Ablenkungen", value: String(distractions) },
    { label: "Gesamtzeit", value: elapsed + "s" },
    { label: "Ø im Vergleich zu anderen Nutzer:innen", value: comparisonLabel },
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
          Ein schlichtes Aufmerksamkeitsprofil, kein medizinischer Befund. Die
          Werte basieren ausschließlich auf deinem Verhalten in diesem Test.
        </p>

        <div className="mt-10 grid grid-cols-4 gap-px overflow-hidden rounded-2xl border border-[#D9D2C3] bg-[#D9D2C3]">
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex min-h-[180px] flex-col justify-between gap-4 bg-[#F5F1EA] p-7"
            >
              <div className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-[#6B6860]">
                {s.label}
              </div>
              <div className="font-serif text-6xl leading-none tracking-tight">
                {s.value}
              </div>
            </div>
          ))}
          <div className="flex min-h-[180px] flex-col justify-between gap-4 bg-[#0F0F0E] p-7">
            <div className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-[#8C8A82]">
              Angeklickte Fun Facts
            </div>
            <div className="font-serif leading-none tracking-tight">
              <span className="text-6xl text-[#D64D1E]">{distractions}</span>
              <span className="text-3xl text-[#6B6860]">/{totalFacts}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-[1fr_auto] items-end gap-8 rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB] p-10">
          <div>
            <p className="font-serif text-2xl leading-snug tracking-tight">
              {isTestDone
                ? getEvalMain(distractions, elapsed, totalFacts)
                : "Starte zuerst den Test. Die Werte aktualisieren sich live."}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#6B6860]">
              {isTestDone
                ? getEvalSub(distractions, elapsed)
                : "Je weniger Fun Facts du anklickst, desto fokussierter warst du. Je mehr, desto stärker hat dich die Umgebung gezogen."}
            </p>
          </div>
          <Button label="Statistiken" onClick={scrollToStatistics} />
        </div>
      </div>
    </section>
  );
}
