import { useEffect } from "react";
import { useInterviewStore } from "@/store/interview.store";
import type { PreparationStatus, PreparationStep } from "@/types/interview.types";

type UseInterviewPreparationOptions = {
  onReady?: () => void;
};

/**
 * Connects preparation state to the real-time interview store.
 * Reactive to Socket.IO events (question arrival, error, etc.).
 */
export function useInterviewPreparation(options: UseInterviewPreparationOptions = {}) {
  const status = useInterviewStore((s) => s.status);
  const error = useInterviewStore((s) => s.error);

  const preparationStatus: PreparationStatus =
    status === "error"
      ? "ERROR"
      : status === "active" || status === "completed"
        ? "READY"
        : "PREPARING";

  useEffect(() => {
    if (preparationStatus === "READY") {
      options.onReady?.();
    }
  }, [preparationStatus, options]);

  const currentStep: PreparationStep =
    status === "error"
      ? "COMPLETE"
      : status === "active" || status === "completed"
        ? "COMPLETE"
        : "ANALYZING_RESUME";

  const completedSteps: PreparationStep[] =
    status === "active" || status === "completed"
      ? ["ANALYZING_RESUME", "UNDERSTANDING_EXPERIENCE", "BUILDING_PLAN", "PREPARING_QUESTIONS", "PREPARING_INTERVIEWER", "COMPLETE"]
      : [];

  return {
    preparationStatus,
    currentStep,
    completedSteps,
    preparationError: error?.message ?? null,
  };
}

