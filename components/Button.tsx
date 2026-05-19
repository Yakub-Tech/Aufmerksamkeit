"use client";

type ButtonProps = {
  label: string;
  onClick?: () => void;
};

export default function Button({ label, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-3 rounded-full bg-[#0F0F0E] px-6 py-4 text-sm font-medium text-[#F5F1EA] transition-all duration-200 hover:scale-[1.03] hover:bg-[#D64D1E] hover:ring-2 hover:ring-[#D64D1E]/30 hover:ring-offset-1 active:scale-[0.97]"
    >
      {label}
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F1EA] text-[#0F0F0E]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </span>
    </button>
  );
}
