"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AttentionTestSection from "@/components/AttentionTestSection";
import EvaluationSection from "@/components/EvaluationSection";
import StatisticsSection from "@/components/StatisticsSection";
import LearningSection from "@/components/LearningSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

export default function Home() {
  const [result, setResult] = useState({ answered: 0, distractions: 0, elapsed: 0 });
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
      <HeroSection />
      <AttentionTestSection onResultChange={setResult} onQuizComplete={() => setQuizDone(true)} />
      <EvaluationSection
        answered={result.answered}
        distractions={result.distractions}
        elapsed={result.elapsed}
        totalQuestions={8}
        totalFacts={16}
      />
      <StatisticsSection />
      <LearningSection />
      <CommunitySection />
      <Footer />
    </>
  );
}
