"use client";
import { useState, useEffect, useCallback } from "react";

const SECTIONS = [
  { id: "home", label: "ERKENNEN", color: "#2E9E8A" },
  { id: "test", label: "TESTEN", color: "#E8553E" },
  { id: "auswertung", label: "AUSWERTEN", color: "#F0A500" },
  { id: "tipps", label: "HANDELN", color: "#D6336C" },
  { id: "community", label: "TEILEN", color: "#7C4DFF" },
];

export default function ScrollGuide() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [segmentFills, setSegmentFills] = useState<number[]>([0, 0, 0, 0]);

  const updateProgress = useCallback(() => {
    const positions = SECTIONS.map((s) => {
      const el = document.getElementById(s.id);
      if (!el) return 0;
      return el.getBoundingClientRect().top + window.scrollY;
    });

    const viewportCenter = window.scrollY + window.innerHeight * 0.35;

    let active = 0;
    for (let i = SECTIONS.length - 1; i >= 0; i--) {
      if (viewportCenter >= positions[i]) {
        active = i;
        break;
      }
    }
    setActiveIndex(active);

    const fills = positions.slice(1).map((endPos, i) => {
      const startPos = positions[i];
      const range = endPos - startPos;
      if (range <= 0) return 0;
      return Math.max(0, Math.min(1, (viewportCenter - startPos) / range));
    });
    setSegmentFills(fills);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, [updateProgress]);

  return (
    <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center xl:flex">
      {SECTIONS.map((section, i) => {
        const isActive = i === activeIndex;
        const isPast = i < activeIndex;
        const fillPct = i > 0 ? (segmentFills[i - 1] ?? 0) * 100 : 0;
        const prevColor = i > 0 ? SECTIONS[i - 1].color : section.color;

        return (
          <div key={section.id} className="flex flex-col items-center">
            {i > 0 && (
              <div
                className="relative overflow-hidden"
                style={{ width: "1px", height: "40px", backgroundColor: "#D7DAE4" }}
              >
                <div
                  className="absolute top-0 left-0 w-full"
                  style={{ height: `${fillPct}%`, backgroundColor: prevColor }}
                />
              </div>
            )}
            <button
              onClick={() => {
                const el = document.getElementById(section.id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative flex cursor-pointer items-center justify-center"
              aria-label={section.label}
            >
              <div
                className="relative flex items-center justify-center rounded-full transition-all duration-300"
                style={{
                  width: isActive ? "16px" : "10px",
                  height: isActive ? "16px" : "10px",
                  backgroundColor: isActive || isPast ? section.color : "#D7DAE4",
                }}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 animate-ping rounded-full opacity-40"
                    style={{ backgroundColor: section.color }}
                  />
                )}
              </div>
              <span
                className="absolute right-6 whitespace-nowrap font-mono text-[9px] uppercase tracking-widest transition-all duration-200"
                style={{
                  opacity: isActive ? 1 : 0,
                  color: section.color,
                  transform: isActive ? "translateX(0)" : "translateX(4px)",
                }}
                aria-hidden
              >
                {section.label}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
