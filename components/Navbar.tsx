"use client";

const menuItems = [
  { label: "Home", href: "#home", locked: false },
  { label: "Statistiken", href: "#statistiken", locked: true },
  { label: "Tipps & Tricks", href: "#tipps", locked: true },
  { label: "FAQ", href: "#faq", locked: true },
];

type NavbarProps = {
  quizDone: boolean;
};

export default function Navbar({ quizDone }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#D9D2C3] bg-[#F5F1EA]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-12 py-4">
        <a href="#home" className="flex items-baseline gap-2">
          <span className="h-2 w-2 rounded-sm bg-[#D64D1E]" />
          <span className="font-serif text-xl tracking-tight">
            Aufmerksamkeit
            <span className="italic text-[#D64D1E]">.</span>
          </span>
        </a>

        <ul className="flex gap-7">
          {menuItems.map((item) => {
            const isLocked = item.locked && !quizDone;
            return (
              <li key={item.href}>
                <a
                  href={isLocked ? undefined : item.href}
                  onClick={isLocked ? (e) => e.preventDefault() : undefined}
                  className={`text-sm font-medium ${
                    isLocked
                      ? "cursor-not-allowed text-[#6B6860] opacity-50"
                      : "text-[#2A2A28] hover:text-[#D64D1E]"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
