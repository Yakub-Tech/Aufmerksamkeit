"use client";
import { useState, useEffect } from "react";

const menuItems = [
  { label: "Home", href: "#home" },
  { label: "Tipps & Tricks", href: "#tipps" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrollPct, setScrollPct] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setScrollPct(total > 0 ? (doc.scrollTop / total) * 100 : 0);
      setScrolled(doc.scrollTop > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#D9D2C3]/60 bg-[#F5F1EA]/80 backdrop-blur-md">
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-12 transition-all duration-300 ${scrolled ? "py-2.5" : "py-4"}`}>
        <a href="#home" className="flex items-baseline gap-2">
          <span className="h-2 w-2 rounded-sm bg-[#D64D1E]" />
          <span className={`font-serif tracking-tight transition-all duration-300 ${scrolled ? "text-lg" : "text-xl"}`}>
            Aufmerksamkeit
            <span className="italic text-[#D64D1E]">.</span>
          </span>
        </a>

        <ul className="flex gap-7">
          {menuItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group relative text-sm font-medium text-[#2A2A28] transition-colors duration-200 hover:text-[#D64D1E]"
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-[#D64D1E] transition-all duration-300 group-hover:w-full" />
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
