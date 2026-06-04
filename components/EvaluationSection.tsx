"use client";

import { useState, useEffect, useRef } from "react";
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

function CountUp({ target, animated, suffix = "" }: { target: number; animated: boolean; suffix?: string }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!animated || started.current) return;
    started.current = true;
    const duration = 800;
    const begin = Date.now();
    let rafId: number;
    function step() {
      const elapsed = Date.now() - begin;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(step);
      else setCount(target);
    }
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [animated, target]);

  return <>{animated ? count : 0}{suffix}</>;
}

function hi(text: string | number) {
  return <span className="italic text-[#E8553E]">{text}</span>;
}

function getEvalMain(
  distractions: number,
  elapsed: number,
  avgDistractions: number,
  avgTime: number,
) {
  if (avgTime === 0) {
    return <>Starte zuerst den Test. Die Werte aktualisieren sich live.</>;
  }

  const timeDiff = avgTime - elapsed;
  const faster = timeDiff > 5;
  const slower = timeDiff < -5;
  const lessDistracted = distractions < avgDistractions;
  const moreDistracted = distractions > avgDistractions;

  if (lessDistracted && faster) {
    return (
      <>
        Du bist eine Person, die fokussiert bleibt, auch wenn es ringsum blinkt.{" "}
        {hi("Ruhiger und schneller")} als die meisten.
      </>
    );
  }
  if (lessDistracted && slower) {
    return (
      <>
        Du bist eine Person, die sich {hi("Zeit nimmt")} und sich dabei kaum ablenken
        lässt. Gründlich statt hektisch – das hat seinen eigenen Wert.
      </>
    );
  }
  if (lessDistracted) {
    return (
      <>
        Du bist eine Person, die Ablenkungen {hi("gut aussitzt")}. Wenig gestört,
        solides Tempo. Das zeigt echte Konzentrationsfähigkeit.
      </>
    );
  }
  if (moreDistracted && faster) {
    return (
      <>
        Du bist eine Person, die {hi("neugierig hinschaut")} und trotzdem zügig
        durchkommt. Diese Offenheit ist eine Stärke.
      </>
    );
  }
  if (moreDistracted && slower) {
    return (
      <>
        Du bist eine Person, die {hi("viel um sich herum wahrnimmt")}. Mit ein
        paar ruhigeren Momenten würdest du diese Neugier noch gezielter einsetzen.
      </>
    );
  }
  if (moreDistracted) {
    return (
      <>
        Du bist eine Person, die auf vieles reagiert. Beim Tempo bist du trotzdem{" "}
        {hi("im Rahmen")} geblieben – das zählt.
      </>
    );
  }
  if (faster) {
    return (
      <>
        Du bist eine Person, die {hi("schnell und strukturiert")} arbeitet. Ablenkungen
        im Normbereich, Tempo überdurchschnittlich.
      </>
    );
  }
  if (slower) {
    return (
      <>
        Du bist eine Person, die sich {hi("nicht hetzen lässt")}. Deine Ablenkungen
        halten sich im Normbereich – du gehst einfach deinen eigenen Weg.
      </>
    );
  }
  return (
    <>
      Du bist eine Person, die {hi("im Gleichgewicht")} liegt. Weder zu viel Tempo
      noch zu viele Ablenkungen. Das ist ein gutes Zeichen.
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
  const [barsVisible, setBarsVisible] = useState(false);
  const [avgTime, setAvgTime] = useState(0);
  const [avgDistractions, setAvgDistractions] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const isTestDone = answered === totalQuestions;

  useEffect(() => {
    if (!isTestDone) return;
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, [isTestDone]);

  useEffect(() => {
    if (!isTestDone) return;
    fetch("/api/test-count")
      .then((res) => res.json())
      .then((data) => {
        setAvgTime(data.avgElapsed);
        setAvgDistractions(data.avgDistractions);
      })
      .catch(() => {});
  }, [isTestDone]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isTestDone) setBarsVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isTestDone]);

  useEffect(() => {
    if (!isTestDone) return;
    const el = statsRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setBarsVisible(true);
    }
  }, [isTestDone]);

  const timeDiff = isTestDone && avgTime > 0 ? avgTime - elapsed : null;
  const timeLabel =
    timeDiff === null
      ? null
      : timeDiff > 5
      ? "SCHNELLER ALS Ø"
      : timeDiff < -5
      ? "LANGSAMER ALS Ø"
      : "ETWA IM Ø";
  const timeBigValue =
    timeDiff === null
      ? "—"
      : Math.abs(timeDiff) > 5
      ? `${Math.abs(timeDiff)}s`
      : "Ø";
  const tempoColor =
    timeDiff === null
      ? "#F0A500"
      : timeDiff > 5
      ? "#4ADE80"
      : timeDiff < -5
      ? "#F87171"
      : "#F0A500";

  const userBarWidth = Math.min(Math.round((hours / MAX_AVG_HOURS) * 100), 100);

  return (
    <section id="auswertung" className="bg-[#0D1425] text-[#F4F5F8]">
      <div className="mx-auto max-w-7xl px-12 py-24">
        <h2 className="font-serif text-6xl leading-tight tracking-tight">
          Deine <span className="italic text-[#E8553E]">Auswertung</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#EAECF2]/80">
          Ein schlichtes Aufmerksamkeitsprofil, kein medizinischer Befund. Die
          Werte basieren ausschließlich auf deinem Verhalten in diesem Test.
        </p>

        <SectionReveal>
        <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[#1A2440] bg-[#1A2440]">
          <div className="flex min-h-[180px] flex-col justify-between gap-4 bg-[#1A2440] p-7">
            <div className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-[#6B6860]">
              Gesamtzeit
            </div>
            <div className="font-serif text-6xl leading-none tracking-tight text-[#F4F5F8]">
              <CountUp target={elapsed} animated={animated} suffix="s" />
            </div>
          </div>
          <div className="flex min-h-[180px] flex-col justify-between gap-4 bg-[#1A2440] p-7">
            <div className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-[#6B6860]">
              Tempo im Vergleich
            </div>
            <div>
              {timeLabel && (
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest" style={{ color: tempoColor }}>
                  {timeLabel}
                </div>
              )}
              <div className="font-serif text-6xl leading-none tracking-tight" style={{ color: tempoColor }}>
                {timeBigValue}
              </div>
              {isTestDone && avgTime > 0 && (
                <div className="mt-2 font-mono text-[11px] text-[#6B6860]">
                  Ø {avgTime}s
                </div>
              )}
            </div>
          </div>
          <div className="flex min-h-[180px] flex-col justify-between gap-4 bg-[#0A1020] p-7">
            <div className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-[#6B6860]">
              Mal abgelenkt
            </div>
            <div>
              <div className="font-serif leading-none tracking-tight">
                <span className="text-6xl text-[#E8553E]">
                  <CountUp target={distractions} animated={animated} />
                </span>
                <span className="text-3xl text-[#6B6860]">/{totalFacts}</span>
              </div>
              {isTestDone && avgDistractions > 0 && (
                <div className="mt-2 font-mono text-[11px] text-[#F0A500]">
                  Ø {avgDistractions}× im Schnitt
                </div>
              )}
            </div>
          </div>
        </div>
        </SectionReveal>

        <SectionReveal>
        <div className="mt-8 rounded-2xl border border-[#1A2440] bg-[#1A2440] p-10">
          <p className="font-serif text-2xl leading-snug tracking-tight text-[#F4F5F8]">
            {isTestDone
              ? getEvalMain(distractions, elapsed, avgDistractions, avgTime)
              : "Starte zuerst den Test. Die Werte aktualisieren sich live."}
          </p>
        </div>
        </SectionReveal>

        <SectionReveal>
        <div className="mt-20">
          <h2 className="font-serif text-5xl leading-tight tracking-tight text-[#F4F5F8]">
            Die Zahlen hinter dem <span className="italic">Gefühl</span>.
          </h2>

          <div ref={statsRef} className="mt-10 grid grid-cols-3 gap-6">

            <div className="rounded-2xl border border-[#1A2440] bg-[#1A2440] p-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#F0A500]">
                Nutzungszeit
              </span>
              <div className="mt-5 flex flex-col gap-2.5 rounded-xl bg-[#0D1425] p-4">
                {usageRows.flatMap((row) => {
                  const barWidth = Math.round((row.avgHours / MAX_AVG_HOURS) * 100);
                  const isUserAge = selectedAge !== "" && row.age === selectedAge;

                  const originalRow = (
                    <div
                      key={row.age}
                      className="grid items-center gap-3 text-xs text-[#EAECF2]"
                      style={{ gridTemplateColumns: "60px 1fr 55px" }}
                    >
                      <span>{row.age}</span>
                      <span className="block h-2 overflow-hidden rounded-full bg-[#2A3550]">
                        <span
                          className="block h-full rounded-full bg-[#3F4A78]"
                          style={{ width: barsVisible ? `${barWidth}%` : "0%", transition: "width 2s ease-out" }}
                        />
                      </span>
                      <span className="text-right font-medium text-[#EAECF2]">{row.avgLabel}</span>
                    </div>
                  );

                  if (isUserAge) {
                    const duRow = (
                      <div
                        key="du"
                        className="grid items-center gap-3 text-xs"
                        style={{ gridTemplateColumns: "60px 1fr 55px" }}
                      >
                        <span className="font-semibold text-[#E8553E]">DU</span>
                        <span className="block h-2 overflow-hidden rounded-full bg-[#2A3550]">
                          <span
                            className="block h-full rounded-full bg-[#E8553E]"
                            style={{ width: barsVisible ? `${userBarWidth}%` : "0%", transition: "width 2s ease-out" }}
                          />
                        </span>
                        <span className="text-right font-medium text-[#E8553E]">{hoursToLabel(hours)}</span>
                      </div>
                    );
                    return [originalRow, duRow];
                  }

                  return [originalRow];
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-[#1A2440] bg-[#1A2440] p-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#F0A500]">
                Auswirkungen
              </span>
              <div className="mt-5 flex flex-col gap-2.5 rounded-xl bg-[#0D1425] p-4">
                {effectOptions.map((effect) => {
                  const isSelected = selectedEffect !== "" && effect.key === selectedEffect;
                  return (
                    <div
                      key={effect.key}
                      className="grid items-center gap-3 text-xs text-[#EAECF2]"
                      style={{ gridTemplateColumns: "110px 1fr 35px" }}
                    >
                      <span className={isSelected ? "font-semibold text-[#E8553E]" : ""}>{effect.label}</span>
                      <span className="block h-2 overflow-hidden rounded-full bg-[#2A3550]">
                        <span
                          className={"block h-full rounded-full " + (isSelected ? "bg-[#E8553E]" : "bg-[#3F4A78]")}
                          style={{ width: barsVisible ? `${effect.value}%` : "0%", transition: "width 2s ease-out" }}
                        />
                      </span>
                      <span className={"text-right font-medium " + (isSelected ? "text-[#E8553E]" : "text-[#EAECF2]")}>
                        {effect.value}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-[#1A2440] bg-[#1A2440] p-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#F0A500]">
                Morgencheck
              </span>
              <div className="mt-5 flex flex-col gap-2.5 rounded-xl bg-[#0D1425] p-4">
                {morningOptions.map((m) => {
                  const isSelected = selectedMorning !== "" && m.key === selectedMorning;
                  return (
                    <div
                      key={m.key}
                      className="grid items-center gap-3 text-xs text-[#EAECF2]"
                      style={{ gridTemplateColumns: "130px 1fr 35px" }}
                    >
                      <span className={isSelected ? "font-semibold text-[#E8553E]" : ""}>{m.label}</span>
                      <span className="block h-2 overflow-hidden rounded-full bg-[#2A3550]">
                        <span
                          className={"block h-full rounded-full " + (isSelected ? "bg-[#E8553E]" : "bg-[#3F4A78]")}
                          style={{ width: barsVisible ? `${m.value}%` : "0%", transition: "width 2s ease-out" }}
                        />
                      </span>
                      <span className={"text-right font-medium " + (isSelected ? "text-[#E8553E]" : "text-[#EAECF2]")}>
                        {m.value}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
        </SectionReveal>
      </div>
    </section>
  );
}
