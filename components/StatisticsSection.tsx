import Card from "./Card";

const stats = [
  {
    label: "Stat 01",
    title: "Tägliche Social-Media-Nutzung nach Altersgruppe",
    description: "Jugendliche und junge Erwachsene verbringen im Schnitt rund vier Stunden pro Tag auf Social Media.",
    source: "Statista, 2024, US",
    bars: [
      { name: "16-24", value: "4h 32m", width: 92, accent: true },
      { name: "25-34", value: "3h 48m", width: 78, accent: false },
      { name: "35-44", value: "3h 02m", width: 62, accent: false },
      { name: "45-54", value: "2h 14m", width: 46, accent: false },
      { name: "55+", value: "1h 34m", width: 32, accent: false },
    ],
  },
  {
    label: "Stat 02",
    title: "Auswirkungen bei 12-17-Jährigen in Deutschland",
    description: "Mehr als jede:r zweite Jugendliche berichtet von Schlafproblemen in Verbindung mit Social Media.",
    source: "Statista, 2023, DE",
    bars: [
      { name: "Schlaf", value: "58%", width: 58, accent: true },
      { name: "Konzentration", value: "49%", width: 49, accent: false },
      { name: "Vergleich", value: "44%", width: 44, accent: false },
      { name: "Stimmung", value: "31%", width: 31, accent: false },
      { name: "Isolation", value: "22%", width: 22, accent: false },
    ],
  },
  {
    label: "Stat 03",
    title: "Problematischer Social-Media-Konsum",
    description: "Der Anteil problematischen Konsums hat sich innerhalb von fünf Jahren mehr als verdoppelt.",
    source: "Statista, 2022, DE",
    bars: [
      { name: "2017", value: "3,2%", width: 24, accent: false },
      { name: "2019", value: "4,6%", width: 41, accent: false },
      { name: "2021", value: "6,1%", width: 55, accent: false },
      { name: "2022", value: "6,7%", width: 68, accent: true },
      { name: "Ø EU", value: "7,1%", width: 72, accent: false },
    ],
  },
];

export default function StatisticsSection() {
  return (
    <section id="statistiken" className="border-t border-[#D9D2C3]">
      <div className="mx-auto max-w-7xl px-12 py-24">
        <h2 className="font-serif text-6xl leading-tight tracking-tight">
          Die Zahlen hinter dem <span className="italic">Gefühl</span>.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#2A2A28]">
          Ein paar harte Zahlen aus aktuellen Studien, damit das Bauchgefühl Kontext bekommt.
        </p>

        <div className="mt-12 grid grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-4">
              <div className="flex flex-col gap-5 rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB] p-6">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#D64D1E]">
                  {stat.label}
                </span>
                <div className="flex flex-col gap-2.5 rounded-xl bg-[#F5F1EA] p-4">
                  {stat.bars.map((bar) => (
                    <div
                      key={bar.name}
                      className="grid grid-cols-[100px_1fr_55px] items-center gap-3 text-xs text-[#2A2A28]"
                    >
                      <span className={bar.accent ? "font-semibold text-[#D64D1E]" : ""}>{bar.name}</span>
                      <span className="block h-2 overflow-hidden rounded-full bg-[#D9D2C3]">
                        <span
                          className={"block h-full rounded-full " + (bar.accent ? "bg-[#D64D1E]" : "bg-[#0F0F0E]")}
                          style={{ width: `${bar.width}%` }}
                        />
                      </span>
                      <span className={"text-right font-medium " + (bar.accent ? "text-[#D64D1E]" : "text-[#0F0F0E]")}>
                        {bar.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                  Quelle: {stat.source}
                </div>
              </div>
              <Card title={stat.title} description={stat.description} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
