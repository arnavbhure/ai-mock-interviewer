import { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "@/store/interview.store";
import type { PreparationStep, PreparationStatus } from "@/types/interview.types";
import {
  startInterview,
  runPreparationSequence,
} from "@/services/interviewService";

type UseInterviewPreparationOptions = {
  onReady?: () => void;
};

/**
 * Drives the preparation step sequence on mount.
 *
 * 1. Calls `startInterview()` mock service.
 * 2. Walks through each preparation step.
 * 3. When all steps reach COMPLETE, marks preparation complete and calls onReady.
 *
 * Cleans up if the component unmounts mid-sequence.
 */
export function useInterviewPreparation(options: UseInterviewPreparationOptions = {}) {
  const { onReady } = options;
  const started = useRef(false);
  const cancelled = useRef(false);

  const [preparationStatus, setPreparationStatus] = useState<PreparationStatus>("PREPARING");
  const [currentStep, setCurrentStep] = useState<PreparationStep>("ANALYZING_RESUME");
  const [completedSteps, setCompletedSteps] = useState<PreparationStep[]>([]);
  const [preparationError, setPreparationError] = useState<string | null>(null);

  const startInterviewAction = useInterviewStore((s) => s.startInterview);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    cancelled.current = false;

    async function run() {
      try {
        // 1. Kick off the interview session
        await startInterview();
        if (cancelled.current) return;

        startInterviewAction();

        // 2. Walk through preparation steps
        await runPreparationSequence((step) => {
          if (cancelled.current) return;
          setCurrentStep(step);
          setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
        });

        if (cancelled.current) return;

        // 3. Mark preparation complete
        setPreparationStatus("READY");
        setCurrentStep("COMPLETE");
        setCompletedSteps((prev) => [...prev, "PREPARING_INTERVIEWER"]);
        onReady?.();
      } catch {
        if (!cancelled.current) {
          setPreparationStatus("ERROR");
          setPreparationError(
            "Something went wrong while preparing your interview. Please try again.",
          );
        }
      }
    }

    run();

    return () => {
      cancelled.current = true;
    };
  }, [startInterviewAction, onReady]);

  return {
    preparationStatus,
    currentStep,
    completedSteps,
    preparationError,
  };
}
