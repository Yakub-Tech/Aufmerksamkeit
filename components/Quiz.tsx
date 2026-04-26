"use client";

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
    <div className="rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB] p-10">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#D64D1E]">
          Frage {current + 1} von {total}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#6B6860]">
          {format(elapsed)}
        </span>
      </div>

      <div className="mt-4 h-px w-full bg-[#D9D2C3]">
        <div
          className="h-full bg-[#D64D1E] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <h3 className="mt-8 font-serif text-4xl leading-tight tracking-tight">
        {text}
      </h3>

      <div className="mt-8 flex flex-col gap-3">
        {options.map((option, idx) => {
          const active = selected === idx;
          return (
            <button
              key={idx}
              onClick={() => onPick(idx)}
              className={
                "flex items-center gap-4 rounded-xl border px-5 py-4 text-left text-sm transition-colors " +
                (active
                  ? "border-[#D64D1E] bg-[#F9EEE6]"
                  : "border-[#D9D2C3] bg-[#F5F1EA] hover:border-[#0F0F0E]")
              }
            >
              <span
                className={
                  "h-4 w-4 flex-none rounded-full border-2 " +
                  (active ? "border-[#D64D1E] bg-[#D64D1E]" : "border-[#D9D2C3]")
                }
              />
              <span className="text-[#0F0F0E]">{option}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between gap-3">
        <button
          onClick={onBack}
          disabled={current === 0}
          className="rounded-full border border-[#0F0F0E] px-6 py-3 text-sm font-medium text-[#0F0F0E] transition-colors hover:bg-[#0F0F0E] hover:text-[#F5F1EA] disabled:cursor-not-allowed disabled:opacity-30"
        >
          Zurück
        </button>
        <button
          onClick={onNext}
          disabled={selected === null}
          className="rounded-full bg-[#0F0F0E] px-6 py-3 text-sm font-medium text-[#F5F1EA] transition-colors hover:bg-[#D64D1E] disabled:cursor-not-allowed disabled:opacity-30"
        >
          {last ? "Zur Auswertung" : "Weiter"}
        </button>
      </div>
    </div>
  );
}
