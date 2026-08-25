import { motion, useReducedMotion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import { PreparationStepList } from "./PreparationStepList";
import type { PreparationStep } from "@/types/interview.types";

type Props = {
  currentStep: PreparationStep;
  completedSteps: PreparationStep[];
  preparationError: string | null;
};

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function PreparationScreen({
  currentStep,
  completedSteps,
  preparationError,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background">
      {/* Background glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative flex w-full max-w-md flex-col items-center px-6">
        {/* Logo icon */}
        <motion.div
          initial={reduced ? false : { scale: 0.85, opacity: 0 }}
          animate={reduced ? false : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease }}
          className="relative"
        >
          <motion.div
            animate={
              reduced
                ? false
                : { scale: [1, 1.06, 1] }
            }
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-surface shadow-card"
          >
            <BrainCircuit className="h-7 w-7 text-primary" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.1 }}
          className="mt-7 text-center text-xl font-semibold tracking-tight text-text sm:text-2xl"
        >
          Preparing your interview
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? false : { opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-2 text-center text-sm text-text-secondary"
        >
          Tailoring your interview to your experience and target role.
        </motion.p>

        {/* Step list */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.3 }}
          className="mt-10 w-full rounded-xl border border-border bg-surface px-6 py-5 shadow-card"
        >
          <PreparationStepList
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </motion.div>

        {/* Error state */}
        {preparationError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-5 text-center text-sm text-error"
          >
            {preparationError}
          </motion.p>
        )}
      </div>
    </div>
  );
}
