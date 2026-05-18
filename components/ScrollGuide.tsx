"use client";
import { useActiveSection } from "@/hooks/useActiveSection";

const SECTIONS = [
  { id: "home", label: "ERKENNEN" },
  { id: "test", label: "TESTEN" },
  { id: "auswertung", label: "AUSWERTEN" },
  { id: "tipps", label: "HANDELN" },
  { id: "community", label: "TEILEN" },
];

const SECTION_IDS = SECTIONS.map((s) => s.id);

export default function ScrollGuide() {
  const activeId = useActiveSection(SECTION_IDS);
  const activeIndex = SECTIONS.findIndex((s) => s.id === activeId);

  return (
    <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center xl:flex">
      {SECTIONS.map((section, i) => {
        const isActive = activeId === section.id;
        const isPast = i < activeIndex;

        return (
          <div key={section.id} className="flex flex-col items-center">
            {i > 0 && (
              <div
                className="w-px transition-colors duration-500"
                style={{
                  height: "32px",
                  backgroundColor: isPast || isActive ? "#D64D1E" : "#D9D2C3",
                }}
              />
            )}
            <button
              onClick={() => {
                const el = document.getElementById(section.id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative flex items-center justify-center"
              aria-label={section.label}
            >
              <div
                className="relative flex items-center justify-center rounded-full transition-all duration-300"
                style={{
                  width: isActive ? "12px" : "8px",
                  height: isActive ? "12px" : "8px",
                  backgroundColor: isActive ? "#D64D1E" : isPast ? "#D64D1E" : "#D9D2C3",
                }}
              >
                {isActive && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#D64D1E] opacity-40" />
                )}
              </div>
              <span
                className="absolute right-5 whitespace-nowrap font-mono text-[9px] uppercase tracking-widest transition-all duration-200"
                style={{
                  opacity: isActive ? 1 : 0,
                  color: isActive ? "#D64D1E" : "#6B6860",
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
