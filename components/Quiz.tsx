"use client";

import { AnimatePresence, motion } from "framer-motion";

type QuizProps = {
  current: number;
  total: number;
  text: string;
  options: string[];
  selected: number | null;
  elapsed: number;
  onPick: (idx: number) => void;
  onBack: () => void;
  onNext: () => void;
};

function format(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

export default function Quiz({
  current,
  total,
  text,
  options,
  selected,
  elapsed,
  onPick,
  onBack,
  onNext,
}: QuizProps) {
  const percent = ((current + (selected !== null ? 1 : 0)) / total) * 100;
  const last = current === total - 1;

  return (
    <div className="rounded-2xl border border-[#1A2440] bg-[#1A2440] p-6">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#3F4A78]">
          Frage {current + 1} von {total}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#6B6860]">
          {format(elapsed)}
        </span>
      </div>

      <div className="mt-3 h-px w-full bg-[#2A3550]">
        <div
          className="h-full bg-[#E8553E] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <h3 className="mt-5 font-serif text-3xl leading-tight tracking-tight text-[#F4F5F8]">
            {text}
          </h3>

          <div className="mt-5 flex flex-col gap-2">
            {options.map((option, idx) => {
              const active = selected === idx;
              return (
                <button
                  key={idx}
                  onClick={() => onPick(idx)}
                  className={
                    "flex cursor-pointer items-center gap-4 rounded-xl border px-5 py-4 text-left text-sm transition-all duration-150 active:scale-[0.98] hover:scale-[1.02] " +
                    (active
                      ? "border-[#E8553E] bg-[#E8553E]/10"
                      : "border-[#2A3550] bg-[#0D1425] hover:border-[#E8553E]")
                  }
                >
                  <span
                    className={
                      "h-4 w-4 flex-none rounded-full border-2 " +
                      (active ? "border-[#E8553E] bg-[#E8553E]" : "border-[#2A3550]")
                    }
                  />
                  <span className={active ? "text-[#F4F5F8]" : "text-[#EAECF2]"}>{option}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex justify-between gap-3">
        <button
          onClick={onBack}
          disabled={current === 0}
          className="cursor-pointer rounded-full border border-[#EAECF2] px-6 py-3 text-sm font-medium text-[#EAECF2] transition-all hover:scale-[1.04] hover:bg-[#EAECF2] hover:text-[#0D1425] disabled:cursor-not-allowed disabled:opacity-30"
        >
          Zurück
        </button>
        <button
          onClick={onNext}
          disabled={selected === null}
          className="cursor-pointer rounded-full bg-[#E8553E] px-6 py-3 text-sm font-medium text-white transition-all hover:scale-[1.04] hover:bg-[#F0A500] disabled:cursor-not-allowed disabled:opacity-30"
        >
          {last ? "Zur Auswertung" : "Weiter"}
        </button>
      </div>
    </div>
  );
}
