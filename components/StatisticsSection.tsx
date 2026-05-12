"use client";

import { useState, useEffect } from "react";

const ageGroups = ["16–24", "25–34", "35–44", "45–54", "55+"];

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

// Tägliche Social-Media-Nutzung nach Altersgruppe (DE, 2024)
const usageRows = [
  { age: "16–24", avgHours: 3.17, avgLabel: "3h 10m" },
  { age: "25–34", avgHours: 2.33, avgLabel: "2h 20m" },
  { age: "35–44", avgHours: 1.58, avgLabel: "1h 35m" },
  { age: "45–54", avgHours: 0.97, avgLabel: "58m" },
  { age: "55+", avgHours: 0.53, avgLabel: "32m" },
];

function hoursToLabel(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  if (hh === 0) return `${mm}m`;
  if (mm === 0) return `${hh}h`;
  return `${hh}h ${mm}m`;
}

const MAX_AVG_HOURS = 3.5;

export default function StatisticsSection() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedAge, setSelectedAge] = useState("");
  const [hours, setHours] = useState(3);
  const [selectedEffect, setSelectedEffect] = useState("");
  const [selectedMorning, setSelectedMorning] = useState("");

  const [duAnimated, setDuAnimated] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    const id = requestAnimationFrame(() => setDuAnimated(true));
    return () => cancelAnimationFrame(id);
  }, [submitted]);

  const userBarWidth = Math.min(Math.round((hours / MAX_AVG_HOURS) * 100), 100);

  return (
    <section id="statistiken">
      <div className="mx-auto max-w-7xl px-12 py-24">
        <h2 className="font-serif text-6xl leading-tight tracking-tight">
          Die Zahlen hinter dem <span className="italic">Gefühl</span>.
        </h2>

        {/* Selbsteinschätzungsformular */}
        <div
          style={{
            maxHeight: submitted ? "0px" : "900px",
            opacity: submitted ? 0 : 1,
            overflow: "hidden",
            transition: "max-height 0.7s ease-in-out, opacity 0.4s ease-in-out",
          }}
        >
          <div className="mt-12 rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB] p-8">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#D64D1E]">
              Selbsteinschätzung
            </span>
            <div className="mt-5 flex gap-12">
              <div className="flex-1">
                <h3 className="font-serif text-3xl leading-snug">
                  Wie viele Stunden verbringst du täglich auf Social Media?
                </h3>

                <div className="mt-6">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                    Deine Altersgruppe
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ageGroups.map((age) => (
                      <button
                        key={age}
                        onClick={() => setSelectedAge(age)}
                        className={
                          "rounded-full border px-3 py-1 font-mono text-xs transition-colors " +
                          (selectedAge === age
                            ? "border-[#D64D1E] bg-[#D64D1E] text-white"
                            : "border-[#D9D2C3] bg-[#F5F1EA] text-[#2A2A28] hover:border-[#D64D1E]")
                        }
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                    Auswirkung, die du am stärksten kennst
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {effectOptions.map((e) => (
                      <button
                        key={e.key}
                        onClick={() => setSelectedEffect(e.key)}
                        className={
                          "rounded-full border px-3 py-1 font-mono text-xs transition-colors " +
                          (selectedEffect === e.key
                            ? "border-[#D64D1E] bg-[#D64D1E] text-white"
                            : "border-[#D9D2C3] bg-[#F5F1EA] text-[#2A2A28] hover:border-[#D64D1E]")
                        }
                      >
                        {e.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                    Wann schaust du morgens zum ersten Mal auf Social Media?
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {morningOptions.map((m) => (
                      <button
                        key={m.key}
                        onClick={() => setSelectedMorning(m.key)}
                        className={
                          "rounded-full border px-3 py-1 font-mono text-xs transition-colors " +
                          (selectedMorning === m.key
                            ? "border-[#D64D1E] bg-[#D64D1E] text-white"
                            : "border-[#D9D2C3] bg-[#F5F1EA] text-[#2A2A28] hover:border-[#D64D1E]")
                        }
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex w-56 flex-col items-center justify-center gap-4">
                <div className="text-center">
                  <span className="font-serif text-8xl text-[#D64D1E]">{hours}</span>
                  <div className="mt-1 font-mono text-sm text-[#6B6860]">STD. / TAG</div>
                </div>
                <div className="w-full">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full accent-[#D64D1E]"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-[#6B6860]">
                    <span>0h</span>
                    <span>2h</span>
                    <span>4h</span>
                    <span>6h</span>
                    <span>8h</span>
                    <span>10h+</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setSubmitted(true)}
                className="rounded-full bg-[#0F0F0E] px-6 py-3 text-sm text-white transition-colors hover:bg-[#D64D1E]"
              >
                Einschätzung absenden
              </button>
            </div>
          </div>
        </div>

        {/* Statistiken */}
        <div
          className="mt-12"
          style={{
            filter: submitted ? "none" : "blur(4px)",
            pointerEvents: submitted ? "auto" : "none",
            userSelect: submitted ? "auto" : "none",
            transition: "filter 0.6s ease-in-out",
          }}
        >
          <div className="grid grid-cols-3 gap-6">

            {/* Nutzungszeit – originale Zeilen bleiben, DU wird darunter eingefügt */}
            <div className="rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB] p-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#D64D1E]">
                Nutzungszeit
              </span>
              <div className="mt-5 flex flex-col gap-2.5 rounded-xl bg-[#F5F1EA] p-4">
                {usageRows.flatMap((row) => {
                  const barWidth = Math.round((row.avgHours / MAX_AVG_HOURS) * 100);
                  const isUserAge = submitted && selectedAge !== "" && row.age === selectedAge;

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
                          style={{ width: submitted ? `${barWidth}%` : "0%", transition: "width 0.8s ease-out" }}
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
                            style={{ width: duAnimated ? `${userBarWidth}%` : "0%", transition: "width 0.8s ease-out" }}
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

            {/* Auswirkungen bei Jugendlichen */}
            <div className="rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB] p-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#D64D1E]">
                Auswirkungen
              </span>
              <div className="mt-5 flex flex-col gap-2.5 rounded-xl bg-[#F5F1EA] p-4">
                {effectOptions.map((effect) => {
                  const isSelected = submitted && selectedEffect !== "" && effect.key === selectedEffect;
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
                          style={{ width: submitted ? `${effect.value}%` : "0%", transition: "width 0.8s ease-out" }}
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

            {/* Erster Check am Morgen */}
            <div className="rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB] p-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#D64D1E]">
                Morgencheck
              </span>
              <div className="mt-5 flex flex-col gap-2.5 rounded-xl bg-[#F5F1EA] p-4">
                {morningOptions.map((m) => {
                  const isSelected = submitted && selectedMorning !== "" && m.key === selectedMorning;
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
                          style={{ width: submitted ? `${m.value}%` : "0%", transition: "width 0.8s ease-out" }}
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
      </div>
    </section>
  );
}
