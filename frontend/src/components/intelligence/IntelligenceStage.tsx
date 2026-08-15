import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/components/intelligence/animations/variants";
import { ResumeStep } from "@/components/intelligence/steps/ResumeStep";
import { AnalysisStep } from "@/components/intelligence/steps/AnalysisStep";
import { AnswerAnalysisStep } from "@/components/intelligence/steps/AnswerAnalysisStep";
import { AdaptiveQuestionStep } from "@/components/intelligence/steps/AdaptiveQuestionStep";
import { cn } from "@/lib/utils";

const STEP_CONTENT = [ResumeStep, AnalysisStep, AnswerAnalysisStep, AdaptiveQuestionStep];

type IntelligenceStageProps = {
  activeIndex: number;
};

/**
 * Desktop stage: all steps live in one slot; only the active step is visible.
 * One deterministic progression — no duplicate content, no looping.
 */
export function IntelligenceStage({ activeIndex }: IntelligenceStageProps) {
  return (
    <div className="w-full">
      <div className="relative h-[560px]">
        {STEP_CONTENT.map((Step, index) => (
          <StageStep key={Step.name} active={activeIndex === index}>
            <Step />
          </StageStep>
        ))}
      </div>
    </div>
  );
}

function StageStep({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 16, scale: active ? 1 : 0.985 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn("absolute inset-0 flex items-center", !active && "pointer-events-none")}
      aria-hidden={!active}
    >
      {children}
    </motion.div>
  );
}
