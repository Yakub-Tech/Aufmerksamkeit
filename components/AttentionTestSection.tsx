"use client";

import { useState, useEffect } from "react";
import Quiz from "./Quiz";
import DistractionPopup from "./DistractionPopup";

type TestResult = {
  answered: number;
  distractions: number;
  elapsed: number;
};

type AttentionTestSectionProps = {
  onResultChange: (r: TestResult) => void;
};

type PopupStyle = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

type PopupItem = {
  id: string;
  question: string;
  answer: string;
  style: PopupStyle;
};

const QUESTIONS = [
  {
    text: "Stell dir vor, du sitzt gerade konzentriert an einer Aufgabe. Kein Klingeln, keine Benachrichtigung. Trotzdem hast du das Gefühl, dass irgendwas auf dich wartet. Wie oft greifst du in so einer Stunde einfach so zum Handy?",
    options: ["Seltener als einmal", "Zwei- bis fünfmal", "Ich habe längst aufgehört zu zählen"],
    popups: [
      {
        question: "Wie oft entsperrt jemand sein Handy im Schnitt täglich?",
        answer: "Mehr als 58 Mal. Meistens ohne konkreten Anlass.",
      },
      {
        question: "Sinkt die Konzentration, wenn das Handy auf dem Tisch liegt, selbst wenn es stumm ist?",
        answer: "Ja. Allein seine Anwesenheit reicht aus, um die Denkleistung messbar zu senken.",
      },
    ],
  },
  {
    text: "Du nimmst dir vor, in Ruhe zu lesen. Kein Social Media, kein Multitasking, einfach nur Text und du. Wie lange schaffst du es wirklich am Stück, bevor dein Blick zum Handy wandert?",
    options: ["Über 30 Minuten", "10 bis 20 Minuten", "Keine 5 Minuten"],
    popups: [
      {
        question: "Wie lange braucht das Gehirn nach einer Unterbrechung, um wieder richtig fokussiert zu sein?",
        answer: "Durchschnittlich 23 Minuten, zeigt eine Studie der University of California.",
      },
      {
        question: "Hat sich die Fähigkeit, sich längere Zeit zu konzentrieren, in den letzten Jahren verändert?",
        answer: "Bei vielen Menschen schon. Besonders bei Bildschirmarbeit fällt es schwerer, wirklich dranzubleiben.",
      },
    ],
  },
  {
    text: "Du sitzt an etwas, das du erledigen musst, aber es macht dir gerade keinen Spaß. Die Aufgabe liegt vor dir, du kommst nicht richtig rein. Was passiert in diesem Moment bei dir?",
    options: ["Ich bleibe dran und atme durch", "Ich mache eine kurze, bewusste Pause", "Ich öffne sofort eine App"],
    popups: [
      {
        question: "Was macht das Gehirn, wenn man Langeweile aushält, anstatt sofort wegzuschalten?",
        answer: "Es aktiviert kreative Netzwerke. Wer kurz aushält, kommt danach oft freier weiter.",
      },
      {
        question: "Warum fühlt sich das schnelle Wechseln zu einer anderen App so befriedigend an?",
        answer: "Das Gehirn wertet es als kleine Belohnung. Ähnlich wie ein Snack, der aber nicht wirklich satt macht.",
      },
    ],
  },
  {
    text: "Du scrollst. Nicht weil du etwas Bestimmtes suchst, sondern weil du einfach scrollst. Reels, Posts, Stories, immer weiter. Irgendwann hörst du auf. Wie geht es dir dann?",
    options: ["Entspannt und informiert", "Neutral, weder gut noch schlecht", "Leer, gereizt oder unzufrieden"],
    popups: [
      {
        question: "Warum ist endloses Scrollen so schwer zu stoppen?",
        answer: "Der Mechanismus ähnelt einem Spielautomaten. Man weiß nie, was als Nächstes kommt, und genau das hält einen beim Scrollen.",
      },
      {
        question: "Wie viele Menschen berichten nach längerem Scrollen von schlechter Stimmung?",
        answer: "Ein großer Teil. Viele sind danach gereizt oder fühlen sich leer, ohne genau zu wissen warum.",
      },
    ],
  },
  {
    text: "Der Wecker klingelt. Die Augen gehen auf, der Tag beginnt. Du liegst noch im Bett und der Morgen ist noch völlig offen. Was machst du als Erstes?",
    options: ["Fast nie aufs Handy", "Manchmal, nach dem Frühstück", "Als Erstes, noch im Bett"],
    popups: [
      {
        question: "Warum ist der Morgen eine besonders empfindliche Zeit für digitale Gewohnheiten?",
        answer: "Die ersten Minuten nach dem Aufwachen beeinflussen, wie das Gehirn den Rest des Tages wahrnimmt.",
      },
      {
        question: "Was berichten Menschen häufiger, die morgens als Erstes Social Media öffnen?",
        answer: "Sie fühlen sich im Tagesverlauf öfter unruhig und haben mehr Schwierigkeiten, sich zu konzentrieren.",
      },
    ],
  },
  {
    text: "Du sitzt mit jemandem zusammen, ein Gespräch läuft, es gibt Dinge zu erzählen. Dein Handy liegt dabei irgendwo in der Nähe. Wie präsent bist du wirklich in diesem Gespräch?",
    options: ["Voll dabei, ich vergesse es komplett", "Manchmal schweifen meine Gedanken ab", "Ich checke es zwischendurch"],
    popups: [
      {
        question: "Was verändert sich in einem Gespräch, wenn das Handy nur auf dem Tisch liegt?",
        answer: "Das Gespräch wird von beiden Seiten als weniger verbunden erlebt, selbst wenn niemand draufschaut.",
      },
      {
        question: "Wie nennt man das Phänomen, Menschen im Gespräch zugunsten des Handys zu ignorieren?",
        answer: "Phubbing, aus phone und snubbing. Der Begriff ist in der Forschung inzwischen fest etabliert.",
      },
    ],
  },
  {
    text: "Du arbeitest an etwas, aber dann öffnest du einfach eine andere App. Nicht weil du müsstest, sondern weil es einfach passiert. Kurz danach bist du schon woanders. Wie oft passiert dir das in einer normalen Arbeitsstunde?",
    options: ["Kaum, ich bleibe bei einer Sache", "Gelegentlich, wenn mich etwas stört", "Dauernd, ich wechsle ständig"],
    popups: [
      {
        question: "Kann das Gehirn wirklich mehrere Dinge gleichzeitig tun?",
        answer: "Nein. Was wie Multitasking aussieht, ist schnelles Umschalten. Das Gehirn arbeitet nie wirklich parallel.",
      },
      {
        question: "Was kostet jeder Wechsel zwischen Aufgaben?",
        answer: "Kognitive Energie und Zeit. Nach jedem Wechsel steigt die Fehlerquote messbar an.",
      },
    ],
  },
  {
    text: "Jemand sagt dir, du sollst dein Handy für zwei Stunden weglegen. Kein Notfall steht bevor, du verpasst nichts Wichtiges. Einfach zwei Stunden ohne. Wie reagierst du innerlich auf diese Vorstellung?",
    options: ["Ich merke es kaum", "Ich werde leicht unruhig", "Ich halte es nicht aus"],
    popups: [
      {
        question: "Was steckt hinter dem Gefühl, etwas zu verpassen, wenn man das Handy weglegt?",
        answer: "FOMO nennt man das. Es ist ein antrainierter Reflex, kein echter Notfall.",
      },
      {
        question: "Was passiert körperlich, wenn man das Handy für eine Weile weglegt?",
        answer: "Der Puls sinkt, die Stimmung verbessert sich. Schon kurze handyfreie Phasen haben messbare Effekte.",
      },
    ],
  },
];

const TOTAL = QUESTIONS.length;

function randomPosition(): PopupStyle {
  const useTop = Math.random() > 0.5;
  const useLeft = Math.random() > 0.5;
  const vert = 20 + Math.floor(Math.random() * 120);
  const horiz = 20 + Math.floor(Math.random() * 150);
  return {
    ...(useTop ? { top: `${vert}px` } : { bottom: `${vert}px` }),
    ...(useLeft ? { left: `${horiz}px` } : { right: `${horiz}px` }),
  };
}

export default function AttentionTestSection({ onResultChange }: AttentionTestSectionProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(TOTAL).fill(null));
  const [opened, setOpened] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [visiblePopups, setVisiblePopups] = useState<PopupItem[]>([]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    setVisiblePopups([]);
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const q = QUESTIONS[current];
    const delay1 = 4000 + Math.floor(Math.random() * 2000);

    const t1 = setTimeout(() => {
      setVisiblePopups((prev) => [
        ...prev,
        {
          id: `${current}-0`,
          question: q.popups[0].question,
          answer: q.popups[0].answer,
          style: randomPosition(),
        },
      ]);

      if (Math.random() > 0.5) {
        const t2 = setTimeout(() => {
          setVisiblePopups((prev) => [
            ...prev,
            {
              id: `${current}-1`,
              question: q.popups[1].question,
              answer: q.popups[1].answer,
              style: randomPosition(),
            },
          ]);
        }, 8000);
        timeouts.push(t2);
      }
    }, delay1);

    timeouts.push(t1);

    return () => {
      timeouts.forEach(clearTimeout);
      setVisiblePopups([]);
    };
  }, [current]);

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

  function openFact(id: string) {
    if (!opened.includes(id)) setOpened([...opened, id]);
  }

  function dismissPopup(id: string) {
    setVisiblePopups((prev) => prev.filter((p) => p.id !== id));
  }

  const question = QUESTIONS[current];

  return (
    <section id="test" className="scroll-mt-[60px] border-t border-[#D9D2C3]">
      <div className="mx-auto max-w-7xl px-12 py-10">
        <h2 className="font-serif text-5xl leading-tight tracking-tight">
          Bist du bereit, deine{" "}
          <span className="italic text-[#D64D1E]">Aufmerksamkeit</span> auf die Probe zu stellen?
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#2A2A28]">
          Teste, wie gut du dich auf eine Aufgabe konzentrieren kannst, während dich digitale Ablenkungen unterbrechen. Das dauert nur wenige Minuten.
        </p>

        <div className="relative mt-6">
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
          {visiblePopups.map((popup) => (
            <DistractionPopup
              key={popup.id}
              question={popup.question}
              answer={popup.answer}
              style={popup.style}
              onReveal={() => openFact(popup.id)}
              onClose={() => dismissPopup(popup.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
