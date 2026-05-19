"use client";

import { useState } from "react";
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

  return (
    <>
      <Navbar />
      <ScrollGuide />
      <HeroSection />
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
        <LearningSection />
      </SectionReveal>
      <SectionReveal>
        <CommunitySection />
      </SectionReveal>
      <SectionReveal>
        <Footer />
      </SectionReveal>
    </>
  );
}
