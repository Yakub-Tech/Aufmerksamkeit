"use client";

import { useState } from "react";

type Fact = {
  title: string;
  body: string;
};

type AttentionMechanicsProps = {
  questionIndex: number;
  facts: Fact[];
  openedCount: number;
  totalFacts: number;
  onOpen: (key: string) => void;
};

export default function AttentionMechanics({
  questionIndex,
  facts,
  openedCount,
  totalFacts,
  onOpen,
}: AttentionMechanicsProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  function toggle(idx: number) {
    if (expanded === idx) {
      setExpanded(null);
    } else {
      setExpanded(idx);
      onOpen(questionIndex + "-" + idx);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#3F4A78]">
          Ablenkungen
        </span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#6B6860]">
          {openedCount} / {totalFacts}
        </span>
      </div>

      <div className="rounded-xl border border-dashed border-[#D7DAE4] bg-[#F4F5F8] p-4 text-xs leading-relaxed text-[#6B6860]">
        Diese Karten sind absichtlich hier. Sie zählen deine Ablenkungen, nicht dein Wissen.
      </div>

      <div className="flex flex-col gap-3">
        {facts.map((fact, idx) => {
          const open = expanded === idx;
          return (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-[#D7DAE4] bg-[#F4F5F8]"
            >
              <button
                onClick={() => toggle(idx)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-4 text-left"
              >
                <span className="font-serif text-base text-[#0F0F0E]">
                  {fact.title}
                </span>
                <span
                  className={
                    "flex h-6 w-6 items-center justify-center rounded-full border text-sm transition-colors " +
                    (open
                      ? "border-[#3F4A78] bg-[#3F4A78] text-[#F4F5F8]"
                      : "border-[#0F0F0E] text-[#0F0F0E]")
                  }
                >
                  {open ? "-" : "+"}
                </span>
              </button>
              {open && (
                <div className="border-t border-[#D7DAE4] px-4 py-3 text-xs leading-relaxed text-[#2A2A28]">
                  {fact.body}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
