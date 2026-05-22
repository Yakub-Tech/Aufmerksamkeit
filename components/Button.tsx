"use client";

import { useState } from "react";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  size?: "md" | "lg";
};

export default function Button({ label, onClick, size = "md" }: ButtonProps) {
  const [flying, setFlying] = useState(false);

  function handleClick() {
    setFlying(true);
    onClick?.();
    setTimeout(() => setFlying(false), 400);
  }

  const padding = size === "lg" ? "px-8 py-5 text-base" : "px-6 py-4 text-sm";

  return (
    <button
      onClick={handleClick}
      className={`group inline-flex items-center rounded-full bg-[#0F0F0E] font-medium text-[#F5F1EA] transition-all duration-200 hover:scale-[1.04] hover:bg-[#D64D1E] active:scale-[0.97] ${padding}`}
    >
      {label}
      <span
        className={`inline-flex h-7 items-center justify-center overflow-hidden rounded-full bg-[#F5F1EA] text-[#0F0F0E] transition-all duration-300 ${
          flying
            ? "ml-3 w-7 translate-x-8 opacity-0"
            : "ml-0 w-0 -translate-x-2 opacity-0 group-hover:ml-3 group-hover:w-7 group-hover:translate-x-0 group-hover:opacity-100"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </span>
    </button>
  );
}
