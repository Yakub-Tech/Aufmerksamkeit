"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import SectionReveal from "./SectionReveal";

const STEPS = [
  {
    title: "Benachrichtigungen aus",
    subtitle: "Schalte ab, was dich ständig unterbricht.",
    iconSrc: "/rive/button + icons/Notification Icon (kein Button).riv",
    iconTrigger: "disableNotifications",
    handySrc: "/rive/handy screen/1. Benachrichtigung_ausschalten.riv",
    autoTrigger: "startDistraction",
    handyTrigger: "disableNotifications",
  },
  {
    title: "Flugmodus aktivieren",
    subtitle: "Weniger Ablenkung, mehr Fokus.",
    iconSrc: "/rive/button + icons/Airplane Mode Icon (kein Button).riv",
    iconTrigger: "enableAirplanMode",
    handySrc: "/rive/handy screen/2. Flugmodus.riv",
    autoTrigger: null,
    handyTrigger: "activateAirplaneMode",
  },
  {
    title: "Graustufenmodus",
    subtitle: "Weniger Reize, weniger Verlangen.",
    iconSrc: "/rive/button + icons/Grey Mode Icon (kein Button).riv",
    iconTrigger: "enableGreyMode",
    handySrc: "/rive/handy screen/3. Graustufenmodus.riv",
    autoTrigger: null,
    handyTrigger: "enableGrayscale",
  },
  {
    title: "App-Timer setzen",
    subtitle: "Begrenze deine Zeit in Social Apps.",
    iconSrc: "/rive/button + icons/App Limit  Icon (kein Button).riv",
    iconTrigger: "enableAppLimit",
    handySrc: "/rive/handy screen/4. Applimit.riv",
    autoTrigger: null,
    handyTrigger: "limtApp",
  },
  {
    title: "Clean Homescreen",
    subtitle: "Nur das, was dir wirklich wichtig ist.",
    iconSrc: "/rive/button + icons/Clean Homescreen Icon (kein Button).riv",
    iconTrigger: "cleanHomescreen",
    handySrc: "/rive/handy screen/5. Clean Homescreen.riv",
    autoTrigger: null,
    handyTrigger: "removeDistractions",
  },
];

function fireInput(input: any, delay: number) {
  const t = setTimeout(() => {
    if (input) input.value = true;
  }, delay);
  return () => clearTimeout(t);
}

function IconRive({ src, trigger, play }: { src: string; trigger: string; play: boolean }) {
  const { rive, RiveComponent } = useRive({ src: encodeURI(src), stateMachines: "State Machine 1", autoplay: true });
  const input = useStateMachineInput(rive, "State Machine 1", trigger);
  useEffect(() => { if (play && input) return fireInput(input, 100); }, [play, input]);
  return <RiveComponent />;
}

function ReglerRive({ used, onActivate }: { used: boolean; onActivate: () => void }) {
  const { rive, RiveComponent } = useRive({ src: encodeURI("/rive/button + icons/enable_button.riv"), stateMachines: "State Machine 1", autoplay: true });
  const input = useStateMachineInput(rive, "State Machine 1", "enableButton");
  return (
    <button
      onClick={() => { if (!used) { fireInput(input, 0); onActivate(); } }}
      disabled={used}
      className={`h-8 w-14 flex-none ${used ? "cursor-default opacity-70" : "cursor-pointer"}`}
    >
      <RiveComponent />
    </button>
  );
}

function PhoneScreen({ src, autoTrigger, handyTrigger, isVisible, isActive }: { src: string; autoTrigger: string | null; handyTrigger: string | null; isVisible: boolean; isActive: boolean }) {
  const { rive, RiveComponent } = useRive({ src: encodeURI(src), stateMachines: "State Machine 1", autoplay: true });
  const autoInput = useStateMachineInput(rive, "State Machine 1", autoTrigger ?? "");
  const mainInput = useStateMachineInput(rive, "State Machine 1", handyTrigger ?? "");
  useEffect(() => { if (isVisible && autoTrigger && autoInput) return fireInput(autoInput, 500); }, [isVisible, autoInput]);
  useEffect(() => { if (isActive && handyTrigger && mainInput) return fireInput(mainInput, 800); }, [isActive, mainInput]);
  return <RiveComponent />;
}

export default function TippsSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [shownStep, setShownStep] = useState<number | null>(null);
  const [usedSteps, setUsedSteps] = useState(STEPS.map(() => false));

  const listRef = useRef<HTMLDivElement>(null);
  const listInView = useInView(listRef, { once: true, margin: "-50px" });

  function handleRegler(idx: number) {
    setUsedSteps((prev) => prev.map((v, i) => (i === idx ? true : v)));
    setShownStep(idx);
    if (idx < STEPS.length - 1) setTimeout(() => setActiveStep(idx + 1), 2000);
  }

  return (
    <section id="tipps">
      <div className="mx-auto max-w-7xl px-12 py-10">
        <h2 className="font-serif text-5xl leading-tight tracking-tight">
          Weniger Ablenkung.
          <br />
          <span className="italic text-[#D64D1E]">Mehr du.</span>
        </h2>
        <p className="mt-3 max-w-md text-sm text-[#6B6860]">
          Folge den Schritten und gewinne die Kontrolle über deine Aufmerksamkeit zurück.
        </p>

        <SectionReveal>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <motion.div
              ref={listRef}
              className="flex flex-col gap-2"
              initial="hidden"
              animate={listInView ? "visible" : "hidden"}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {STEPS.map((step, idx) => {
                const isActive = idx === activeStep;
                const isDone = idx < activeStep;
                const isLocked = idx > activeStep;
                return (
                  <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}>
                    <div className={`flex items-center gap-3 rounded-2xl border p-3 transition-all duration-500 ${isActive ? "border-[#D64D1E] bg-[#F9EEE6]" : isDone ? "border-[#D9D2C3] bg-[#EEE7DB]" : "border-[#D9D2C3] bg-[#EEE7DB] opacity-40"}`}>
                      <div className="h-10 w-10 flex-none overflow-hidden rounded-xl border border-[#D9D2C3] bg-[#F9EEE6]">
                        <IconRive src={step.iconSrc} trigger={step.iconTrigger} play={isActive || isDone} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-[10px] tracking-widest text-[#D64D1E]">Tipp {idx + 1}</span>
                        <p className="font-serif text-xl leading-tight">{step.title}</p>
                        <p className="text-sm text-[#6B6860]">{step.subtitle}</p>
                      </div>
                      {!isLocked && <ReglerRive used={usedSteps[idx]} onActivate={() => handleRegler(idx)} />}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <div className="flex h-full items-center justify-center overflow-hidden">
              <div className="relative h-full w-full overflow-hidden">
                {STEPS.map((step, idx) => {
                  const isVisible = shownStep === null ? idx === 0 : shownStep === idx;
                  return (
                    <div key={idx} className="absolute inset-0 transition-opacity duration-500" style={{ opacity: isVisible ? 1 : 0 }}>
                      <PhoneScreen
                        src={step.handySrc}
                        autoTrigger={step.autoTrigger}
                        handyTrigger={step.handyTrigger}
                        isVisible={isVisible}
                        isActive={shownStep === idx}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
