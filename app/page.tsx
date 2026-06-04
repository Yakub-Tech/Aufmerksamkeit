"use client";

import { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AttentionTestSection from "@/components/AttentionTestSection";
import EvaluationSection from "@/components/EvaluationSection";
import TippsSection from "@/components/TippsSection";
import CommunityBanner from "@/components/CommunityBanner";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";
import ScrollGuide from "@/components/ScrollGuide";

export default function Home() {
  const [result, setResult] = useState({
    answered: 0,
    distractions: 0,
    elapsed: 0,
    selectedAge: "",
    hours: 0,
    selectedEffect: "",
    selectedMorning: "",
  });
  const [quizDone, setQuizDone] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });
    lenisRef.current = lenis;
    lenis.stop();
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    history.scrollRestoration = "manual";
    const html = document.documentElement;
    const body = document.body;
    if (scrollLocked) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      window.scrollTo(0, 0);
      lenisRef.current?.stop();
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
      lenisRef.current?.start();
    }
    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [scrollLocked]);

  function handleStart() {
    setScrollLocked(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById("test")?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  return (
    <>
      <Navbar locked={scrollLocked} />
      <ScrollGuide />
      <HeroSection onStart={handleStart} />
      <AttentionTestSection
          onResultChange={setResult}
          onQuizComplete={(elapsed, distractions) => {
            setQuizDone(true);
            fetch("/api/test-count", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ elapsed, distractions }),
            }).catch(() => {});
          }}
        />
      <div
        style={{
          filter: quizDone ? "blur(0)" : "blur(8px)",
          transition: "filter 1s ease",
          pointerEvents: quizDone ? "auto" : "none",
        }}
      >
        <EvaluationSection
          answered={result.answered}
          distractions={result.distractions}
          elapsed={result.elapsed}
          totalQuestions={12}
          totalFacts={24}
          selectedAge={result.selectedAge}
          hours={result.hours}
          selectedEffect={result.selectedEffect}
          selectedMorning={result.selectedMorning}
        />
      </div>
      <TippsSection />
      <CommunityBanner />
      <CommunitySection />
      <Footer />
    </>
  );
}
