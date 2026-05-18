"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AttentionTestSection from "@/components/AttentionTestSection";
import EvaluationSection from "@/components/EvaluationSection";
import LearningSection from "@/components/LearningSection";
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

  useEffect(() => {
    if (quizDone) return;

    function onScroll() {
      const section = document.getElementById("test");
      if (!section) return;
      const maxY = section.offsetTop + section.offsetHeight - window.innerHeight;
      if (window.scrollY > maxY) {
        window.scrollTo(0, Math.max(0, maxY));
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [quizDone]);

  return (
    <>
      <Navbar quizDone={quizDone} />
      <ScrollGuide />
      <HeroSection />
      <AttentionTestSection onResultChange={setResult} onQuizComplete={() => setQuizDone(true)} />
      <SectionReveal>
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
      </SectionReveal>
      <SectionReveal>
        <LearningSection />
      </SectionReveal>
      <SectionReveal>
        <CommunitySection />
      </SectionReveal>
      <Footer />
    </>
  );
}
