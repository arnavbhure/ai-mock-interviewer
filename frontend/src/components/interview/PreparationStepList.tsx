import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import type { PreparationStep } from "@/types/interview.types";
import {
  PREPARATION_STEPS,
  PREPARATION_STEP_LABELS,
} from "@/types/interview.types";
import { cn } from "@/lib/utils";

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
 * animated indicators, and sequential state transitions.
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
        className="absolute left-[13px] top-[16px] w-[2px] bg-border/50"
        style={{ height: `calc(100% - 32px)` }}
        aria-hidden="true"
      />

      {/* Vertical progress fill (animated) */}
      <motion.div
        className="absolute left-[13px] top-[16px] w-[2px] origin-top bg-primary/30"
        style={{ height: `calc(100% - 32px)` }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: progress }}
        transition={{ duration: 0.6, ease }}
        aria-hidden="true"
      />

      {/* Steps */}
      <ul className="relative flex flex-col gap-5">
        {displaySteps.map((step, index) => {
          const state = getStepState(step, currentStep, completedSteps);

          return (
            <motion.li
              key={step}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                ease,
                delay: index * 0.06,
              }}
              className="flex items-center gap-4"
            >
              {/* Indicator */}
              <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center">
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
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </motion.span>
                  ) : state === "processing" ? (
                    <motion.span
                      key="processing"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="relative flex h-7 w-7 items-center justify-center"
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
                      {/* Core indicator */}
                      <motion.span
                        className="h-7 w-7 rounded-full border-2 border-primary bg-primary/8"
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      {/* Center dot */}
                      <motion.span
                        className="absolute h-2 w-2 rounded-full bg-primary"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="waiting"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-text-muted/50" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[13px] font-medium transition-all duration-slow sm:text-sm",
                  state === "completed" && "text-text-secondary",
                  state === "processing" && "text-text",
                  state === "waiting" && "text-text-muted",
                )}
              >
                {PREPARATION_STEP_LABELS[step]}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
