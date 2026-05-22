"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
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


const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function TippsSection() {
  const [openTip, setOpenTip] = useState<boolean[]>(TIPPS.map(() => false));

  const tipsRef = useRef<HTMLDivElement>(null);
  const tipsInView = useInView(tipsRef, { once: true, margin: "-50px" });

  function toggleTip(idx: number) {
    setOpenTip((prev) => prev.map((v, i) => (i === idx ? !v : v)));
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
        <motion.div
          ref={tipsRef}
          className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[#D9D2C3] bg-[#D9D2C3]"
          variants={gridVariants}
          initial="hidden"
          animate={tipsInView ? "visible" : "hidden"}
        >
          {TIPPS.map((tipp, idx) => {
            const open = openTip[idx];
            return (
              <motion.div key={idx} variants={itemVariants}>
                <button
                  onClick={() => toggleTip(idx)}
                  className="flex w-full flex-col gap-3 bg-[#F5F1EA] p-6 text-left transition-all hover:scale-[1.01] hover:bg-[#EEE7DB]"
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
              </motion.div>
            );
          })}
        </motion.div>
        </SectionReveal>

      </div>
    </section>
  );
}
