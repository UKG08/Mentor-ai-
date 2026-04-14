import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Scene3D from "./components/Scene3D";
import Hero from "./components/Hero";
import AnalysisGrid from "./components/AnalysisGrid";
import Header from "./components/Header";
import { analyzeIdea } from "./api";

export default function App() {
  const [stage, setStage] = useState(-1); // -1: Hero, 0-11: Analyzing, 12: Done
  const [data, setData] = useState(null);

  const startAnalysis = async (idea) => {
    setStage(0);
    try {
      const result = await analyzeIdea(idea, setStage);
      setData(result);
      setStage(12);
    } catch (e) {
      setStage(-1);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 overflow-hidden font-sans">
      <Scene3D stage={stage} />
      <Header />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {stage === -1 ? (
            <Hero onLaunch={startAnalysis} />
          ) : (
            <AnalysisGrid currentStage={stage} result={data} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}