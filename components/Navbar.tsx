"use client";
import { useState, useEffect } from "react";

const menuItems = [
  { label: "Home", href: "#home" },
  { label: "Tipps & Tricks", href: "#tipps" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setScrollPct(total > 0 ? (doc.scrollTop / total) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#D9D2C3]/60 bg-[#F5F1EA]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-12 py-4">
        <a href="#home" className="flex items-baseline gap-2">
          <span className="h-2 w-2 rounded-sm bg-[#D64D1E]" />
          <span className="font-serif text-xl tracking-tight">
            Aufmerksamkeit
            <span className="italic text-[#D64D1E]">.</span>
          </span>
        </a>

        <ul className="flex gap-7">
          {menuItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm font-medium text-[#2A2A28] transition-colors duration-200 hover:text-[#D64D1E]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="absolute bottom-0 left-0 h-[2px] bg-[#D64D1E] transition-all duration-100"
        style={{ width: `${scrollPct}%` }}
      />
    </nav>
  );
}
