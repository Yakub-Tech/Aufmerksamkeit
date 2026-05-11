export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-7xl px-12 py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <a href="#home" className="flex items-baseline gap-2">
              <span className="h-2 w-2 rounded-sm bg-[#D64D1E]" />
              <span className="font-serif text-lg tracking-tight">
                Aufmerksamkeit<span className="italic text-[#D64D1E]">.</span>
              </span>
            </a>
            <span className="text-sm text-[#6B6860]">
              Interaktive Webanwendung zur Aufmerksamkeitsökonomie.
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
            Statistiken: Statista
          </span>
        </div>

        <div className="mt-10 border-t border-[#D9D2C3] pt-8">
          <div className="font-serif text-2xl tracking-tight">Projektinformationen</div>

          <div className="mt-5 grid grid-cols-4 gap-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                Entwicklung
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#2A2A28]">
                Yakub Uyar<br />
                Softwareentwicklung<br />
                Aufmerksamkeit
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                Entstehung
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#2A2A28]">
                Eigenständig entwickelt.
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                Kontakt
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#2A2A28]">
                GitHub: Yakub-Tech
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                Rive-Assets
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#2A2A28]">
                Rive-Gestaltung: anonyme Mitwirkende.<br />
                Integration und Zustandssteuerung: Yakub Uyar
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
