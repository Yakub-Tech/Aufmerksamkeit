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
    <nav className="sticky top-0 z-50 border-b border-[#D7DAE4]/60 bg-[#F4F5F8]/80 backdrop-blur-md">
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-12 transition-all duration-300 ${scrolled ? "py-2.5" : "py-4"}`}>
        <a href="#home" className="flex items-baseline gap-2">
          <span className="h-2 w-2 rounded-sm bg-[#3F4A78]" />
          <span className={`font-serif tracking-tight transition-all duration-300 ${scrolled ? "text-lg" : "text-xl"}`}>
            Aufmerksamkeit
            <span className="italic text-[#3F4A78]">.</span>
          </span>
        </a>

        <ul className="flex gap-7">
          {menuItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={locked ? (e) => e.preventDefault() : undefined}
                aria-disabled={locked || undefined}
                className={`group relative text-sm font-medium transition-colors duration-200 ${locked ? "cursor-not-allowed text-[#6B6860] opacity-50" : "cursor-pointer text-[#2A2A28] hover:text-[#3F4A78]"}`}
              >
                {item.label}
                {!locked && (
                  <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-[#3F4A78] transition-all duration-300 group-hover:w-full" />
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>

    </nav>
  );
}
