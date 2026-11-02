import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { PreparationStep } from "@/types/interview.types";
import {
  PREPARATION_STEPS,
  PREPARATION_STEP_LABELS,
} from "@/types/interview.types";
import { cn } from "@/lib/utils";

export const PREPARATION_STEP_SUBTITLES: Record<PreparationStep, string> = {
  READING_RESUME: "Parsing document structure & raw text",
  UNDERSTANDING_EXPERIENCE: "Extracting skills, projects, and work history",
  STRUCTURING_PROFILE: "Vectorizing text into 1024-d pgvector embeddings",
  PREPARING_CONTEXT: "Synthesizing customized rubrics for your role",
  FINALIZING_INTERVIEW: "Calibrating conceptual and algorithmic rounds",
  CREATING_INTERVIEW_PLAN: "Assembling live interview state machine",
};

type Props = {
  currentStep: PreparationStep;
  completedSteps: PreparationStep[];
};

type StepState = "completed" | "processing" | "waiting";

function getStepState(
  step: PreparationStep,
  currentStep: PreparationStep,
  completedSteps: PreparationStep[],
): StepState {
  if (completedSteps.includes(step)) {
    return "completed";
  }
  if (step === currentStep) return "processing";
  return "waiting";
}

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Polished step-progress list with vertical connecting line,
 * animated indicators, subtitles, and sequential state transitions.
 */
export function PreparationStepList({ currentStep, completedSteps }: Props) {
  const displaySteps = PREPARATION_STEPS;

  // Calculate progress for the vertical fill line (0 → 1)
  const progress = useMemo(() => {
    const total = displaySteps.length;
    if (total <= 1) return 0;

    let filled = completedSteps.length;
    const currentIdx = displaySteps.indexOf(currentStep);
    if (currentIdx > filled) {
      filled = currentIdx;
    }

    return Math.min(filled / (total - 1), 1);
  }, [completedSteps, currentStep, displaySteps]);

  return (
    <div className="relative" role="list" aria-label="Preparation steps">
      {/* Vertical track line (background) */}
      <div
        className="absolute left-[15px] top-[18px] w-[2px] bg-border/40"
        style={{ height: `calc(100% - 36px)` }}
        aria-hidden="true"
      />

      {/* Vertical progress fill (animated) */}
      <motion.div
        className="absolute left-[15px] top-[18px] w-[2px] origin-top bg-gradient-to-b from-primary via-indigo-500 to-cyan-500"
        style={{ height: `calc(100% - 36px)` }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: progress }}
        transition={{ duration: 0.5, ease }}
        aria-hidden="true"
      />

      {/* Steps */}
      <ul className="relative flex flex-col gap-4">
        {displaySteps.map((step, index) => {
          const state = getStepState(step, currentStep, completedSteps);
          const subtitle = PREPARATION_STEP_SUBTITLES[step];

          return (
            <motion.li
              key={step}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.35,
                ease,
                delay: index * 0.04,
              }}
              className="flex items-start gap-3.5 group"
            >
              {/* Indicator */}
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center mt-0.5">
                <AnimatePresence mode="wait">
                  {state === "completed" ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 18,
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs shadow-emerald-500/20"
                    >
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    </motion.span>
                  ) : state === "processing" ? (
                    <motion.span
                      key="processing"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="relative flex h-8 w-8 items-center justify-center"
                    >
                      {/* Outer pulse ring */}
                      <motion.span
                        className="absolute inset-0 rounded-full border-2 border-primary/30"
                        animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                        aria-hidden="true"
                      />
                      {/* Core indicator with spinning ring */}
                      <motion.span
                        className="h-7 w-7 rounded-full border-2 border-primary/40 bg-primary/10 flex items-center justify-center"
                        animate={{ scale: [1, 1.04, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                      </motion.span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="waiting"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border/80 bg-surface/80"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-text-muted/40" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Label & Contextual Subtitle */}
              <div className="flex flex-col min-w-0 pt-0.5">
                <span
                  className={cn(
                    "text-xs sm:text-[13px] font-semibold tracking-tight transition-colors duration-200",
                    state === "completed" && "text-text",
                    state === "processing" && "text-primary",
                    state === "waiting" && "text-text-muted",
                  )}
                >
                  {PREPARATION_STEP_LABELS[step]}
                </span>
                <span
                  className={cn(
                    "text-[11px] transition-colors duration-200 mt-0.5",
                    state === "completed" && "text-text-muted",
                    state === "processing" && "text-text-secondary font-medium",
                    state === "waiting" && "text-text-muted/50",
                  )}
                >
                  {subtitle}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

export default PreparationStepList;
