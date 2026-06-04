"use client";
import { useState, useEffect, useRef } from "react";
import Button from "./Button";

function Counter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let rafId: number;

    const delay = setTimeout(() => {
      const begin = Date.now();

      function step() {
        const elapsed = Date.now() - begin;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        }
      }

      rafId = requestAnimationFrame(step);
    }, 600);

    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(rafId);
    };
  }, [target, duration]);

  return <>{count.toLocaleString("de-DE")}</>;
}

export default function HeroSection({ onStart }: { onStart: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [testCount, setTestCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/test-count")
      .then((res) => res.json())
      .then((data) => setTestCount(data.count))
      .catch(() => setTestCount(0));
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const phaseRef = useRef<"initial" | "scroll-bound">("initial");

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});

    const onEnded = () => {
      phaseRef.current = "scroll-bound";
    };
    video.addEventListener("ended", onEnded);

    let rafId = 0;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(() => {
        ticking = false;
        if (phaseRef.current !== "scroll-bound") return;
        const section = sectionRef.current;
        if (!section || !video.duration || isNaN(video.duration)) return;
        const height = section.offsetHeight;
        const progress = Math.min(Math.max(window.scrollY / height, 0), 1);
        const target = (1 - progress) * video.duration;
        if (!video.paused) video.pause();
        video.currentTime = target;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      video.removeEventListener("ended", onEnded);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const fadeIn = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-[calc(100vh-60px)] overflow-hidden"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-bottom"
        muted
        playsInline
        preload="metadata"
        poster="/images/hero.jpeg"
      >
        <source src="/videos/generated_video_mp.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-r from-[#0D1425]/88 via-[#0D1425]/55 to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100vh-60px)] max-w-7xl flex-col justify-center px-12 py-16">
        <div
          className="flex flex-wrap justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-[#F4F5F8]/60"
          style={fadeIn(0)}
        >
          <span>Digitale Ablenkung und bewusster Umgang mit dem Smartphone</span>
        </div>

        <div className="mt-8 max-w-2xl">
          <h1 className="font-serif text-[5.5rem] leading-[0.98] tracking-tight text-[#F4F5F8]">
            {[
              { text: "Die", italic: false, delay: 150 },
              { text: "Aufmerksamkeit", italic: true, color: "#E8553E", delay: 230 },
              { text: "ist die wichtigste", italic: false, delay: 310 },
              { text: "Ressource des Internets.", italic: false, delay: 390 },
            ].map((chunk, i) => (
              <span
                key={i}
                className={chunk.italic ? "italic" : ""}
                style={{ ...fadeIn(chunk.delay), ...(chunk.color ? { color: chunk.color } : {}) }}
              >
                {chunk.text}{" "}
              </span>
            ))}
          </h1>

          <p
            className="mt-6 max-w-xl text-lg leading-relaxed text-[#EAECF2]"
            style={fadeIn(350)}
          >
            Social Media, Dark Patterns, Dauer-Scrolling <br />
            Sie alle wollen dasselbe: deine Zeit und deinen Fokus. <br />Wie gut kannst du dich heute noch konzentrieren?
          </p>

          <div className="mt-6 flex flex-col items-start gap-3" style={fadeIn(500)}>
            <div className="relative">
              <div className="cta-glow-layer absolute inset-0 rounded-full" />
              <div className="animate-cta-glow rounded-full border border-[#E8553E]/60">
                <Button label="Jetzt loslegen" onClick={onStart} size="lg" />
              </div>
            </div>
            <p className="font-serif text-base italic text-[#F4F5F8]/60">
              Bereits{" "}
              <span className="text-[#E8553E]">
                {testCount !== null ? (
                  <Counter target={testCount} duration={2000} />
                ) : (
                  "…"
                )}
              </span>{" "}
              Personen haben ihren Fokus getestet
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
