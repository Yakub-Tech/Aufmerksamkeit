"use client";
import { useState } from "react";
import SectionReveal from "./SectionReveal";

const TIPPS = [
  {
    title: "Benachrichtigungen abschalten",
    body: "Jede Push-Mitteilung ist eine kleine Unterbrechung. Reduziere sie auf das, was wirklich zählt.",
  },
  {
    title: "Feste Fokuszeiten",
    body: "Plane 25- bis 50-Minuten-Blöcke, in denen du nur an einer Sache arbeitest.",
  },
  {
    title: "Handy außer Sichtweite",
    body: "Schon das sichtbare Smartphone kostet Konzentration. Leg es in eine Schublade.",
  },
  {
    title: "Graustufen-Modus",
    body: "Weniger Farbe, weniger Sogwirkung. Der Bildschirm wird schlagartig langweiliger.",
  },
  {
    title: "Eine App zur Zeit",
    body: "Kein paralleles Scrollen beim Arbeiten, Essen oder Lernen.",
  },
  {
    title: "Digitale Auszeiten",
    body: "Plane bewusst ein bis zwei Stunden am Tag ganz ohne Bildschirm.",
  },
];

const FAQS = [
  {
    q: "Warum fällt es mir so schwer, länger als 10 Minuten zu lesen?",
    a: "Dein Gehirn hat sich an kurze, schnelle Reize gewöhnt. Lesen erfordert anhaltende Konzentration, und diese Fähigkeit kannst du wie einen Muskel trainieren.",
  },
  {
    q: "Ist Multitasking wirklich ein Mythos?",
    a: "Ja. Was sich wie Multitasking anfühlt, ist schnelles Hin- und Herwechseln zwischen Aufgaben. Jeder Wechsel kostet Zeit und Energie, bis zu 40 % mehr Bearbeitungszeit.",
  },
  {
    q: "Wie schnell gewöhnt sich mein Gehirn an weniger Ablenkung?",
    a: "Erste Effekte zeigen sich oft nach wenigen Tagen. Nach zwei bis drei Wochen berichten viele Menschen von deutlich längeren Fokusphasen.",
  },
  {
    q: "Machen Kurzvideos wirklich dümmer?",
    a: "So pauschal stimmt das nicht. Studien deuten aber darauf hin, dass exzessiver Konsum die Fähigkeit beeinträchtigt, lange Texte konzentriert zu verarbeiten.",
  },
  {
    q: "Hilft es, das Handy komplett auszuschalten?",
    a: "In klar abgegrenzten Zeiten: ja. Ein abgeschaltetes Handy während Lern- oder Arbeitsphasen reduziert die kognitive Last spürbar.",
  },
];

export default function LearningSection() {
  const [openTip, setOpenTip] = useState<boolean[]>(TIPPS.map(() => false));
  const [openFaq, setOpenFaq] = useState<boolean[]>(FAQS.map(() => false));

  function toggleTip(idx: number) {
    setOpenTip((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  }

  function toggleFaq(idx: number) {
    setOpenFaq((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  }

  return (
    <section id="tipps">
      <div className="mx-auto max-w-7xl px-12 py-24">
        <h2 className="font-serif text-6xl leading-tight tracking-tight">
          Möchtest du deine <span className="italic">Aufmerksamkeit</span> verbessern?
        </h2>
        <p className="mt-4 font-serif text-3xl italic text-[#6B6860]">
          Hier findest du Tipps und Tricks.
        </p>

        <SectionReveal>
        <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[#D9D2C3] bg-[#D9D2C3]">
          {TIPPS.map((tipp, idx) => {
            const open = openTip[idx];
            return (
              <button
                key={idx}
                onClick={() => toggleTip(idx)}
                className="flex flex-col gap-3 bg-[#F5F1EA] p-6 text-left transition-colors hover:bg-[#EEE7DB]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] tracking-widest text-[#D64D1E]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h5 className="font-serif text-xl leading-tight">{tipp.title}</h5>
                  </div>
                  <span
                    className="flex-none text-lg leading-none transition-transform duration-300"
                    style={{
                      transform: open ? "rotate(45deg)" : "rotate(0deg)",
                      color: open ? "#D64D1E" : "#6B6860",
                    }}
                  >
                    +
                  </span>
                </div>
                <div
                  style={{
                    maxHeight: open ? "200px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                  }}
                >
                  <p className="pb-1 text-sm leading-relaxed text-[#2A2A28]">{tipp.body}</p>
                </div>
              </button>
            );
          })}
        </div>
        </SectionReveal>

        <SectionReveal>
        <div id="faq" className="mt-20">
          <h3 className="font-serif text-5xl leading-tight tracking-tight">
            Fragen aus der <span className="italic">Community</span>.
          </h3>

          <div className="mt-10 border-t border-[#D9D2C3]">
            {FAQS.map((faq, idx) => {
              const open = openFaq[idx];
              return (
                <div key={idx} className="border-b border-[#D9D2C3]">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left font-serif text-2xl leading-snug tracking-tight transition-colors duration-200 hover:text-[#D64D1E]"
                  >
                    <span>{faq.q}</span>
                    <span
                      className="flex h-7 w-7 flex-none items-center justify-center rounded-full border text-base transition-all duration-300"
                      style={{
                        transform: open ? "rotate(45deg)" : "rotate(0deg)",
                        borderColor: open ? "#D64D1E" : "#D9D2C3",
                        color: open ? "#D64D1E" : "#2A2A28",
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    style={{
                      maxHeight: open ? "200px" : "0px",
                      overflow: "hidden",
                      transition: "max-height 0.35s ease",
                    }}
                  >
                    <p className="pb-6 text-base leading-relaxed text-[#2A2A28]">{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </SectionReveal>
      </div>
    </section>
  );
}
