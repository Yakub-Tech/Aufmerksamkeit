"use client";
import { useState, useEffect, useRef } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import SectionReveal from "./SectionReveal";

function LogoRive() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const { rive, RiveComponent } = useRive({
    src: encodeURI("/rive/logo/Logo.riv"),
    stateMachines: "State Machine 1",
    autoplay: true,
  });
  const input = useStateMachineInput(rive, "State Machine 1", "draw");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !input) return;
    const t = setTimeout(() => {
      input.value = true;
    }, 200);
    return () => clearTimeout(t);
  }, [visible, input]);

  return (
    <span ref={ref} className="inline-block h-5 w-5">
      <RiveComponent />
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0D1425] text-[#F4F5F8]">
      <SectionReveal>
      <div className="mx-auto max-w-7xl px-12 py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <a href="#home" className="group flex items-center gap-1.5 transition-opacity duration-200 hover:opacity-70">
              <LogoRive />
              <span className="font-serif text-lg tracking-tight">
                ufmerksamkeit<span className="italic text-[#3F4A78]">.</span>
              </span>
            </a>
            <span className="text-sm text-[#6B6860]">
              Interaktive Webanwendung zur Aufmerksamkeitsökonomie.
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
            Statistiken: Statista
          </span>
        </div>

        <div className="mt-10 border-t border-[#1A2440] pt-8">
          <div className="font-serif text-2xl tracking-tight">Projektinformationen</div>

          <div className="mt-5 grid grid-cols-4 gap-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                Entwicklung
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#EAECF2]">
                Yakub Uyar<br />
                Softwareentwicklung<br />
                Aufmerksamkeit
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                Entstehung
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#EAECF2]">
                Eigenständig entwickelt.
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                Kontakt
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#EAECF2]">
                GitHub: Yakub-Tech
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                Rive-Assets
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#EAECF2]">
                Rive-Gestaltung: anonyme Mitwirkende.<br />
                Integration und Zustandssteuerung: Yakub Uyar
              </p>
            </div>
          </div>
        </div>
      </div>
      </SectionReveal>
    </footer>
  );
}
