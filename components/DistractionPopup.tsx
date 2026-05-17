"use client";

import { useState } from "react";

type DistractionPopupProps = {
  question: string;
  answer: string;
  style: { top?: string; bottom?: string; left?: string; right?: string };
  onReveal: () => void;
  onClose: () => void;
  dark?: boolean;
};

export default function DistractionPopup({
  question,
  answer,
  style,
  onReveal,
  onClose,
  dark = false,
}: DistractionPopupProps) {
  const [revealed, setRevealed] = useState(false);

  function handleReveal() {
    setRevealed(true);
    onReveal();
  }

  return (
    <div
      className={
        "animate-popup-in absolute z-10 w-80 rounded-2xl border " +
        (dark ? "border-[#0F0F0E] bg-[#0F0F0E]" : "border-[#D9D2C3] bg-[#EEE7DB]")
      }
      style={style}
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#D64D1E]">
          Wusstest du?
        </span>
        <button
          onClick={onClose}
          className={
            "text-xl leading-none transition-colors " +
            (dark ? "text-[#6B6860] hover:text-[#F5F1EA]" : "text-[#6B6860] hover:text-[#0F0F0E]")
          }
          aria-label="Schließen"
        >
          ×
        </button>
      </div>

      <div className="px-5 py-3">
        <p className={"font-serif text-lg leading-snug " + (dark ? "text-[#F5F1EA]" : "text-[#0F0F0E]")}>
          {question}
        </p>
      </div>

      <div className="px-5 pb-5">
        {revealed ? (
          <p className={"text-sm leading-relaxed " + (dark ? "text-[#EEE7DB]" : "text-[#2A2A28]")}>
            {answer}
          </p>
        ) : (
          <button
            onClick={handleReveal}
            className={
              "rounded-full px-5 py-2.5 text-sm font-medium transition-colors " +
              (dark
                ? "bg-[#D64D1E] text-white hover:bg-[#F9EEE6] hover:text-[#D64D1E]"
                : "bg-[#0F0F0E] text-[#F5F1EA] hover:bg-[#D64D1E]")
            }
          >
            Antwort aufdecken
          </button>
        )}
      </div>
    </div>
  );
}
