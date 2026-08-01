import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BrainCircuit, ChevronRight, LoaderCircle } from "lucide-react";
import { StepCard } from "@/components/how-it-works/StepCard";

const difficultyLevels = ["Easy", "Medium", "Hard"];
const categories = ["Resume discussion", "Technical depth", "System thinking", "Behavioral fit"];
const questionCards = [
  "Explain the tradeoffs in your component architecture.",
  "How would you scale this interview flow across roles?",
  "What would you optimize first for accuracy?",
];

export function InterviewPlanStep() {
  const reduceMotion = useReducedMotion();
  const [difficultyIndex, setDifficultyIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setDifficultyIndex((current) => (current + 1) % difficultyLevels.length);
      setQuestionIndex((current) => (current + 1) % questionCards.length);
    }, 2800);

    return () => window.clearInterval(timerId);
  }, []);

  return (
    <StepCard
      step="02"
      title="Generate Personalized Interview"
      description="The AI turns the parsed resume into a structured interview plan with the right difficulty and question mix."
    >
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[24px] border border-border bg-surface p-4 shadow-card">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            <BrainCircuit size={14} className="text-primary" />
            Planning
          </div>
          <div className="mt-4 space-y-3">
            {difficultyLevels.map((level, index) => {
              const isActive = index === difficultyIndex;

              return (
                <div
                  key={level}
                  className={`rounded-[18px] border px-4 py-3 transition-colors ${
                    isActive ? "border-primary/20 bg-primary/8" : "border-border/70 bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}>{level}</span>
                    <LoaderCircle size={14} className={isActive ? "animate-spin text-primary" : "text-muted-foreground"} />
                  </div>
                  <motion.div
                    animate={isActive ? { width: ["35%", "100%", "58%"] } : { width: "24%" }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="mt-3 h-1.5 rounded-full bg-primary/80"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[24px] border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Question mix</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <motion.span
                key={category}
                animate={reduceMotion ? undefined : { y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.12 }}
                className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-foreground"
              >
                {category}
              </motion.span>
            ))}
          </div>

          <div className="mt-5 grid gap-3">
            {questionCards.map((question, index) => {
              const isVisible = index === questionIndex;

              return (
                <motion.div
                  key={question}
                  initial={false}
                  animate={{ opacity: isVisible ? 1 : 0.5, x: isVisible ? 0 : 10, scale: isVisible ? 1 : 0.98 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`rounded-[18px] border px-4 py-3 text-sm leading-6 ${
                    isVisible ? "border-primary/20 bg-primary/8 text-foreground" : "border-border/70 bg-surface text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{question}</span>
                    <ChevronRight size={14} className={isVisible ? "text-primary" : "text-muted-foreground"} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </StepCard>
  );
}
