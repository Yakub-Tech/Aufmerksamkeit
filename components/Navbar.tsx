"use client";
import { useState, useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

const menuItems = [
  { label: "Home", href: "#top" },
  { label: "Tipps & Tricks", href: "#tipps" },
  { label: "Community", href: "#community" },
];

function LogoRive() {
  const { rive, RiveComponent } = useRive({
    src: encodeURI("/rive/logo/Logo.riv"),
    stateMachines: "State Machine 1",
    autoplay: true,
  });
  const input = useStateMachineInput(rive, "State Machine 1", "draw");

  useEffect(() => {
    if (!input) return;
    const t = setTimeout(() => {
      input.value = true;
    }, 300);
    return () => clearTimeout(t);
  }, [input]);

  return <RiveComponent />;
}

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
    <nav className={`nav-glass sticky top-0 z-50 border-b border-[#D7DAE4]/50 bg-gradient-to-b backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 ${scrolled ? "from-[#F4F5F8]/50 to-[#F4F5F8]/35" : "from-[#F4F5F8]/40 to-[#F4F5F8]/25"}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-12 transition-all duration-300 ${scrolled ? "py-2.5" : "py-4"}`}>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center gap-1.5">
          <span className={`flex-none transition-all duration-300 ${scrolled ? "h-5 w-5" : "h-6 w-6"}`}>
            <LogoRive />
          </span>
          <span className={`font-serif tracking-tight transition-all duration-300 ${scrolled ? "text-lg" : "text-xl"}`}>
            ufmerksamkeit
            <span className="italic text-[#3F4A78]">.</span>
          </span>
        </a>

        <ul className="flex gap-7">
          {menuItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (locked) return;
                  if (item.href === "#top") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    const el = document.querySelector(item.href);
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
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
