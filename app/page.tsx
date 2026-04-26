"use client";

import { useState } from "react";
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

  return (
    <>
      <Navbar />
      <HeroSection />
      <AttentionTestSection onResultChange={setResult} />
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
