import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FeatureCard } from "@/components/features-section/FeatureCard";

const difficultySteps = [
  { label: "Easy", tone: "text-success" },
  { label: "Medium", tone: "text-warning" },
  { label: "Hard", tone: "text-error" },
];

export function AdaptiveCard() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % difficultySteps.length);
    }, 2600);

    return () => window.clearInterval(timerId);
  }, []);

  return (
    <FeatureCard
      index={2}
      eyebrow="Adaptive engine"
      title="Adaptive question engine"
      description="Question difficulty increases as the candidate gains confidence, keeping the interview appropriately challenging."
      className="xl:col-span-4"
    >
      <div className="flex h-full flex-col justify-between rounded-[22px] border border-border/70 bg-background p-4">
        <div className="space-y-3">
          {difficultySteps.map((step, index) => {
            const isActive = index === stepIndex;

            return (
              <motion.div
                key={step.label}
                animate={{ x: isActive ? 8 : 0, opacity: isActive ? 1 : 0.55 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-center justify-between rounded-[18px] border px-4 py-3 ${
                  isActive ? "border-primary/25 bg-primary/8" : "border-border/70 bg-card"
                }`}
              >
                <span className={`text-sm font-medium ${step.tone}`}>{step.label}</span>
                <ChevronDown size={16} className="text-muted-foreground" />
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 rounded-[18px] border border-border/70 bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Current focus</p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {stepIndex === 0
              ? "Foundational implementation details and core reasoning."
              : stepIndex === 1
                ? "Tradeoffs, scalability, and product-quality decisions."
                : "Deeper edge cases, architecture, and interviewer-level rigor."}
          </p>
        </div>
      </div>
    </FeatureCard>
  );
}
