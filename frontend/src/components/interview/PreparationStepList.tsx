import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
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
  if (completedSteps.includes(step) || step === "COMPLETE" && currentStep === "COMPLETE") {
    return "completed";
  }
  if (step === currentStep) return "processing";
  return "waiting";
}

const ease = [0.16, 1, 0.3, 1] as const;

export function PreparationStepList({ currentStep, completedSteps }: Props) {
  // Display all steps except COMPLETE (that's handled as a final state elsewhere)
  const displaySteps = PREPARATION_STEPS.slice(0, -1);

  return (
    <ul className="flex flex-col gap-3" role="list" aria-label="Preparation steps">
      <AnimatePresence mode="popLayout">
        {displaySteps.map((step) => {
          const state = getStepState(step, currentStep, completedSteps);

          return (
            <motion.li
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease }}
              className="flex items-center gap-3"
            >
              {/* Icon */}
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-base",
                  state === "completed" && "bg-primary/10 text-primary",
                  state === "processing" && "bg-primary/10 text-primary",
                  state === "waiting" && "bg-background-secondary text-text-muted",
                )}
              >
                {state === "completed" ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </motion.span>
                ) : state === "processing" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>

              {/* Label */}
              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-base",
                  state === "completed" && "text-text",
                  state === "processing" && "text-primary",
                  state === "waiting" && "text-text-muted",
                )}
              >
                {PREPARATION_STEP_LABELS[step]}
              </span>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
