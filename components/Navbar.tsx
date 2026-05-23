"use client";
import { useState, useEffect } from "react";

const menuItems = [
  { label: "Home", href: "#home" },
  { label: "Tipps & Tricks", href: "#tipps" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar({ locked = false }: { locked?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(document.documentElement.scrollTop > 20);
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
                onClick={locked ? (e) => e.preventDefault() : undefined}
                aria-disabled={locked || undefined}
                className={`group relative text-sm font-medium transition-colors duration-200 ${locked ? "cursor-not-allowed text-[#6B6860] opacity-50" : "text-[#2A2A28] hover:text-[#D64D1E]"}`}
              >
                {item.label}
                {!locked && (
                  <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-[#D64D1E] transition-all duration-300 group-hover:w-full" />
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>

    </nav>
  );
}
