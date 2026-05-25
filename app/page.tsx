"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AttentionTestSection from "@/components/AttentionTestSection";
import EvaluationSection from "@/components/EvaluationSection";
import TippsSection from "@/components/TippsSection";
import CommunityBanner from "@/components/CommunityBanner";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";
import ScrollGuide from "@/components/ScrollGuide";
import SectionReveal from "@/components/SectionReveal";

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

  useEffect(() => {
    history.scrollRestoration = "manual";
    const html = document.documentElement;
    const body = document.body;
    if (scrollLocked) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
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
      <SectionReveal>
        <AttentionTestSection onResultChange={setResult} onQuizComplete={() => setQuizDone(true)} />
      </SectionReveal>
      <SectionReveal>
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
      </SectionReveal>
      <SectionReveal>
        <TippsSection />
      </SectionReveal>
      <CommunityBanner />
      <SectionReveal>
        <CommunitySection />
      </SectionReveal>
      <SectionReveal>
        <Footer />
      </SectionReveal>
    </>
  );
}
