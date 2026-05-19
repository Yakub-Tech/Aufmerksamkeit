"use client";

import { useState, useEffect } from "react";
import SectionReveal from "./SectionReveal";

const effectOptions = [
  { key: "Schlaf", label: "Schlafprobleme", value: 58 },
  { key: "Konzentration", label: "Konzentration", value: 49 },
  { key: "Vergleich", label: "Vergleichsdruck", value: 44 },
  { key: "Stimmung", label: "Stimmungstief", value: 31 },
  { key: "Isolation", label: "Soziale Isolation", value: 22 },
];

const morningOptions = [
  { key: "sofort", label: "Direkt beim Aufwachen", value: 41 },
  { key: "erstestunde", label: "Innerhalb 1 Stunde", value: 32 },
  { key: "zweistunden", label: "Nach 1–2 Stunden", value: 16 },
  { key: "mittag", label: "Erst ab Mittag", value: 7 },
  { key: "nie", label: "Gar nicht morgens", value: 4 },
];

const usageRows = [
  { age: "16–24", avgHours: 3.17, avgLabel: "3h 10m" },
  { age: "25–34", avgHours: 2.33, avgLabel: "2h 20m" },
  { age: "35–44", avgHours: 1.58, avgLabel: "1h 35m" },
  { age: "45–54", avgHours: 0.97, avgLabel: "58m" },
  { age: "55+", avgHours: 0.53, avgLabel: "32m" },
];

const MAX_AVG_HOURS = 3.5;

function hoursToLabel(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  if (hh === 0) return `${mm}m`;
  if (mm === 0) return `${hh}h`;
  return `${hh}h ${mm}m`;
}

const AVG_TIME_SECONDS = 45;
const AVG_DISTRACTIONS = 4;

type EvaluationSectionProps = {
  answered: number;
  distractions: number;
  elapsed: number;
  totalQuestions: number;
  totalFacts: number;
  selectedAge: string;
  hours: number;
  selectedEffect: string;
  selectedMorning: string;
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
  selectedAge,
  hours,
  selectedEffect,
  selectedMorning,
}: EvaluationSectionProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (answered !== totalQuestions) return;
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, [answered, totalQuestions]);

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

  const userBarWidth = Math.min(Math.round((hours / MAX_AVG_HOURS) * 100), 100);

  return (
    <section id="auswertung">
      <div className="mx-auto max-w-7xl px-12 py-24">
        <h2 className="font-serif text-6xl leading-tight tracking-tight">
          Deine <span className="italic text-[#D64D1E]">Auswertung</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#2A2A28]">
          Ein schlichtes Aufmerksamkeitsprofil, kein medizinischer Befund. Die
          Werte basieren ausschließlich auf deinem Verhalten in diesem Test.
        </p>

        <SectionReveal>
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
        </SectionReveal>

        <SectionReveal>
        <div className="mt-8 rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB] p-10">
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
        </SectionReveal>

        <SectionReveal>
        <div className="mt-20">
          <h2 className="font-serif text-5xl leading-tight tracking-tight">
            Die Zahlen hinter dem <span className="italic">Gefühl</span>.
          </h2>

          <div className="mt-10 grid grid-cols-3 gap-6">

            <div className="rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB] p-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#D64D1E]">
                Nutzungszeit
              </span>
              <div className="mt-5 flex flex-col gap-2.5 rounded-xl bg-[#F5F1EA] p-4">
                {usageRows.flatMap((row) => {
                  const barWidth = Math.round((row.avgHours / MAX_AVG_HOURS) * 100);
                  const isUserAge = selectedAge !== "" && row.age === selectedAge;

                  const originalRow = (
                    <div
                      key={row.age}
                      className="grid items-center gap-3 text-xs text-[#2A2A28]"
                      style={{ gridTemplateColumns: "60px 1fr 55px" }}
                    >
                      <span>{row.age}</span>
                      <span className="block h-2 overflow-hidden rounded-full bg-[#D9D2C3]">
                        <span
                          className="block h-full rounded-full bg-[#0F0F0E]"
                          style={{ width: animated ? `${barWidth}%` : "0%", transition: "width 0.8s ease-out" }}
                        />
                      </span>
                      <span className="text-right font-medium text-[#0F0F0E]">{row.avgLabel}</span>
                    </div>
                  );

                  if (isUserAge) {
                    const duRow = (
                      <div
                        key="du"
                        className="grid items-center gap-3 text-xs"
                        style={{ gridTemplateColumns: "60px 1fr 55px" }}
                      >
                        <span className="font-semibold text-[#D64D1E]">DU</span>
                        <span className="block h-2 overflow-hidden rounded-full bg-[#D9D2C3]">
                          <span
                            className="block h-full rounded-full bg-[#D64D1E]"
                            style={{ width: animated ? `${userBarWidth}%` : "0%", transition: "width 0.8s ease-out" }}
                          />
                        </span>
                        <span className="text-right font-medium text-[#D64D1E]">{hoursToLabel(hours)}</span>
                      </div>
                    );
                    return [originalRow, duRow];
                  }

                  return [originalRow];
                })}
              </div>
              <div className="mt-5 font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                Quelle: Statista, 2024, DE
              </div>
            </div>

            <div className="rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB] p-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#D64D1E]">
                Auswirkungen
              </span>
              <div className="mt-5 flex flex-col gap-2.5 rounded-xl bg-[#F5F1EA] p-4">
                {effectOptions.map((effect) => {
                  const isSelected = selectedEffect !== "" && effect.key === selectedEffect;
                  return (
                    <div
                      key={effect.key}
                      className="grid items-center gap-3 text-xs text-[#2A2A28]"
                      style={{ gridTemplateColumns: "110px 1fr 35px" }}
                    >
                      <span className={isSelected ? "font-semibold text-[#D64D1E]" : ""}>{effect.label}</span>
                      <span className="block h-2 overflow-hidden rounded-full bg-[#D9D2C3]">
                        <span
                          className={"block h-full rounded-full " + (isSelected ? "bg-[#D64D1E]" : "bg-[#0F0F0E]")}
                          style={{ width: animated ? `${effect.value}%` : "0%", transition: "width 0.8s ease-out" }}
                        />
                      </span>
                      <span className={"text-right font-medium " + (isSelected ? "text-[#D64D1E]" : "text-[#0F0F0E]")}>
                        {effect.value}%
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                Quelle: Statista, 2023, DE
              </div>
            </div>

            <div className="rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB] p-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#D64D1E]">
                Morgencheck
              </span>
              <div className="mt-5 flex flex-col gap-2.5 rounded-xl bg-[#F5F1EA] p-4">
                {morningOptions.map((m) => {
                  const isSelected = selectedMorning !== "" && m.key === selectedMorning;
                  return (
                    <div
                      key={m.key}
                      className="grid items-center gap-3 text-xs text-[#2A2A28]"
                      style={{ gridTemplateColumns: "130px 1fr 35px" }}
                    >
                      <span className={isSelected ? "font-semibold text-[#D64D1E]" : ""}>{m.label}</span>
                      <span className="block h-2 overflow-hidden rounded-full bg-[#D9D2C3]">
                        <span
                          className={"block h-full rounded-full " + (isSelected ? "bg-[#D64D1E]" : "bg-[#0F0F0E]")}
                          style={{ width: animated ? `${m.value}%` : "0%", transition: "width 0.8s ease-out" }}
                        />
                      </span>
                      <span className={"text-right font-medium " + (isSelected ? "text-[#D64D1E]" : "text-[#0F0F0E]")}>
                        {m.value}%
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                Quelle: Statista, 2024, DE
              </div>
            </div>

          </div>
        </div>
        </SectionReveal>
      </div>
    </section>
  );
}
