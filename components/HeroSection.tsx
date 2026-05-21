"use client";
import { useState, useEffect, useRef } from "react";
import Button from "./Button";

function Counter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let rafId: number;

    const delay = setTimeout(() => {
      const begin = Date.now();

      function step() {
        const elapsed = Date.now() - begin;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        }
      }

      rafId = requestAnimationFrame(step);
    }, 600);

    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(rafId);
    };
  }, [target, duration]);

  return <>{count.toLocaleString("de-DE")}</>;
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  function scrollToTest() {
    const el = document.getElementById("test");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  const fadeIn = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-60px)]"
      style={{
        backgroundImage: "url('/images/hero.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#F5F1EA]/90 via-[#F5F1EA]/60 to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100vh-60px)] max-w-7xl flex-col justify-center px-12 py-16">
        <div
          className="flex flex-wrap justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-[#6B6860]"
          style={fadeIn(0)}
        >
          <span>Digitale Ablenkung und bewusster Umgang mit dem Smartphone</span>
          <span>Band 01 — Fokus im Zeitalter der Ablenkung</span>
        </div>

        <div className="mt-8 max-w-2xl">
          <h1 className="font-serif text-[5.5rem] leading-[0.98] tracking-tight">
            {[
              { text: "Die", italic: false, delay: 150 },
              { text: "Aufmerksamkeit", italic: true, delay: 230 },
              { text: "ist die wichtigste", italic: false, delay: 310 },
              { text: "Ressource des Internets.", italic: false, delay: 390 },
            ].map((chunk, i) => (
              <span
                key={i}
                className={chunk.italic ? "italic text-[#D64D1E]" : ""}
                style={fadeIn(chunk.delay)}
              >
                {chunk.text}{" "}
              </span>
            ))}
          </h1>

          <p
            className="mt-6 max-w-xl text-lg leading-relaxed text-[#2A2A28]"
            style={fadeIn(350)}
          >
            Social Media, Dark Patterns, Dauer-Scrolling <br />
            Sie alle wollen dasselbe: deine Zeit und deinen Fokus. Wie gut kannst du dich heute noch konzentrieren?
          </p>

          <div className="mt-6 flex flex-col items-start gap-3" style={fadeIn(500)}>
            <div className="animate-cta-pulse rounded-full">
              <Button label="Jetzt loslegen" onClick={scrollToTest} size="lg" />
            </div>
            <p className="font-serif text-sm italic text-[#6B6860]">
              Bereits{" "}
              <span className="text-[#D64D1E]">
                <Counter target={1247} />
              </span>{" "}
              Personen haben ihren Fokus getestet
            </p>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        style={fadeIn(800)}
      >
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#6B6860]">
          Scroll
        </span>
        <svg
          width="16"
          height="20"
          viewBox="0 0 16 20"
          fill="none"
          className="animate-bounce text-[#6B6860]"
        >
          <path
            d="M8 1v14M2 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
