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
    status === "error" || status === "active" || status === "completed"
      ? "FINALIZING_INTERVIEW"
      : "READING_RESUME";

  const completedSteps: PreparationStep[] =
    status === "active" || status === "completed"
      ? [
          "READING_RESUME",
          "UNDERSTANDING_EXPERIENCE",
          "STRUCTURING_PROFILE",
          "PREPARING_CONTEXT",
          "FINALIZING_INTERVIEW",
        ]
      : [];

  return {
    preparationStatus,
    currentStep,
    completedSteps,
    preparationError: error?.message ?? null,
  };
}

