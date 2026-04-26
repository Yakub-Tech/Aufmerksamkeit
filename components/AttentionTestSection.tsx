"use client";

import { useState, useEffect } from "react";
import Quiz from "./Quiz";
import AttentionMechanics from "./AttentionMechanics";

type TestResult = {
  answered: number;
  distractions: number;
  elapsed: number;
};

type AttentionTestSectionProps = {
  onResultChange: (r: TestResult) => void;
};

const QUESTIONS = [
  {
    text: "Wie oft greifst du pro Stunde unbewusst zum Handy?",
    options: ["Seltener als einmal", "Zwei- bis fünfmal", "Ich habe längst aufgehört zu zählen"],
    funFacts: [
      {
        title: "Fun Fact 1",
        body: "Die durchschnittliche Person entsperrt ihr Handy über 58-mal pro Tag, meist ohne konkreten Anlass.",
      },
      {
        title: "Fun Fact 2",
        body: "Schon das reine Sichtbarsein des Handys auf dem Tisch senkt messbar die Konzentration.",
      },
    ],
  },
  {
    text: "Wie lange kannst du am Stück lesen, ohne auf dein Handy zu schauen?",
    options: ["Über 30 Minuten", "10 bis 20 Minuten", "Keine 5 Minuten"],
    funFacts: [
      {
        title: "Fun Fact 1",
        body: "Nach einer Unterbrechung braucht das Gehirn rund 23 Minuten, um zurück in den vorherigen Fokus zu finden.",
      },
      {
        title: "Fun Fact 2",
        body: "Seit dem Jahr 2000 ist die durchschnittliche Aufmerksamkeitsspanne bei Bildschirmarbeit deutlich gesunken.",
      },
    ],
  },
  {
    text: "Was machst du, wenn dir beim Arbeiten langweilig wird?",
    options: ["Ich bleibe dran und atme durch", "Ich mache eine kurze, bewusste Pause", "Ich öffne sofort eine App"],
    funFacts: [
      {
        title: "Fun Fact 1",
        body: "Langeweile ist ein wichtiger Zustand für kreatives Denken. Sie wird aber oft sofort weggescrollt.",
      },
      {
        title: "Fun Fact 2",
        body: "Kurzer Fokus-Wechsel wirkt wie eine Belohnung im Gehirn, ähnlich wie Zucker oder Koffein.",
      },
    ],
  },
  {
    text: "Wie fühlst du dich nach längerem Scrollen?",
    options: ["Entspannt und informiert", "Neutral, weder gut noch schlecht", "Leer, gereizt oder unzufrieden"],
    funFacts: [
      {
        title: "Fun Fact 1",
        body: "Endloses Scrollen löst im Gehirn einen ähnlichen Mechanismus aus wie ein Spielautomat.",
      },
      {
        title: "Fun Fact 2",
        body: "Viele Menschen berichten nach längerer Social-Media-Nutzung von leichter Gereiztheit, ohne den Grund zu kennen.",
      },
    ],
  },
  {
    text: "Wie oft schaust du direkt nach dem Aufwachen aufs Handy?",
    options: ["Fast nie", "Manchmal, nach dem Frühstück", "Als Erstes, noch im Bett"],
    funFacts: [
      {
        title: "Fun Fact 1",
        body: "Die ersten Minuten nach dem Aufwachen prägen den Ton des ganzen Tages, auch digital.",
      },
      {
        title: "Fun Fact 2",
        body: "Wer morgens sofort Social Media öffnet, berichtet häufiger von innerer Unruhe im Tagesverlauf.",
      },
    ],
  },
  {
    text: "Wie gut kannst du ein Gespräch führen, ohne ans Handy zu denken?",
    options: ["Problemlos, ich vergesse es komplett", "Manchmal schweifen meine Gedanken ab", "Ich checke es zwischendurch"],
    funFacts: [
      {
        title: "Fun Fact 1",
        body: "Ein stummgeschaltetes Handy auf dem Tisch reicht, damit Gespräche als weniger verbunden empfunden werden.",
      },
      {
        title: "Fun Fact 2",
        body: "Der Begriff Phubbing beschreibt das Ignorieren von Menschen zugunsten des Handys.",
      },
    ],
  },
  {
    text: "Wie oft öffnest du eine App, obwohl eine andere gerade offen ist?",
    options: ["Kaum, ich bleibe bei einer Sache", "Gelegentlich, wenn mich etwas stört", "Dauernd, ich wechsle ständig"],
    funFacts: [
      {
        title: "Fun Fact 1",
        body: "Echtes Multitasking existiert nicht. Das Gehirn wechselt, statt parallel zu arbeiten.",
      },
      {
        title: "Fun Fact 2",
        body: "Jeder Task-Wechsel verbraucht kognitive Energie und erhöht die Fehlerquote messbar.",
      },
    ],
  },
  {
    text: "Was passiert, wenn du dein Handy zwei Stunden weglegst?",
    options: ["Ich merke es kaum", "Ich werde leicht unruhig", "Ich halte es nicht aus"],
    funFacts: [
      {
        title: "Fun Fact 1",
        body: "Das Gefühl, etwas zu verpassen (FOMO), ist ein antrainierter Reflex, kein echter Notfall.",
      },
      {
        title: "Fun Fact 2",
        body: "Schon kurze handyfreie Phasen senken den Puls und verbessern die subjektive Stimmung.",
      },
    ],
  },
];

const TOTAL = QUESTIONS.length;
const TOTAL_FACTS = TOTAL * 2;

export default function AttentionTestSection({ onResultChange }: AttentionTestSectionProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(TOTAL).fill(null));
  const [opened, setOpened] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const answeredCount = answers.filter((a) => a !== null).length;

  useEffect(() => {
    onResultChange({
      answered: answeredCount,
      distractions: opened.length,
      elapsed,
    });
  }, [answeredCount, opened.length, elapsed, onResultChange]);

  function pick(idx: number) {
    if (!running && answeredCount === 0) setRunning(true);
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  }

  function goNext() {
    if (current < TOTAL - 1) {
      setCurrent(current + 1);
    } else {
      setRunning(false);
      const el = document.getElementById("auswertung");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function goBack() {
    if (current > 0) setCurrent(current - 1);
  }

  function openFact(key: string) {
    if (!opened.includes(key)) setOpened([...opened, key]);
  }

  const question = QUESTIONS[current];

  return (
    <section id="test" className="border-t border-[#D9D2C3]">
      <div className="mx-auto max-w-7xl px-12 py-24">
        <div className="mb-6 font-mono text-[11px] uppercase tracking-widest text-[#6B6860]">
          Der Test
        </div>
        <h2 className="font-serif text-6xl leading-tight tracking-tight">
          Bist du bereit, deine{" "}
          <span className="italic text-[#D64D1E]">Aufmerksamkeit</span> auf die Probe zu stellen?
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#2A2A28]">
          Teste, wie gut du dich auf eine Aufgabe konzentrieren kannst, während dich digitale Ablenkungen unterbrechen. Das dauert nur wenige Minuten.
        </p>

        <div className="mt-10 grid grid-cols-[2fr_1fr] items-start gap-6">
          <Quiz
            current={current}
            total={TOTAL}
            text={question.text}
            options={question.options}
            selected={answers[current]}
            elapsed={elapsed}
            onPick={pick}
            onBack={goBack}
            onNext={goNext}
          />
          <AttentionMechanics
            key={current}
            questionIndex={current}
            facts={question.funFacts}
            openedCount={opened.length}
            totalFacts={TOTAL_FACTS}
            onOpen={openFact}
          />
        </div>
      </div>
    </section>
  );
}
