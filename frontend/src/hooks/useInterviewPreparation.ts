import { useEffect, useRef } from "react";
import { useInterviewStore } from "@/store/interview.store";
import {
  startInterview,
  runPreparationSequence,
} from "@/services/interviewService";

/**
 * Drives the preparation step sequence on mount.
 *
 * 1. Calls `startInterview()` to get an interviewId.
 * 2. Walks through each preparation step via the mock service.
 * 3. When all steps reach COMPLETE, transitions the store to READY.
 *
 * Cleans up if the component unmounts mid-sequence.
 */
export function useInterviewPreparation() {
  const started = useRef(false);
  const cancelled = useRef(false);

  const store = useInterviewStore();

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    cancelled.current = false;

    async function run() {
      try {
        // 1. Kick off the interview session
        const { interviewId } = await startInterview();
        if (cancelled.current) return;

        useInterviewStore.setState({ interviewId });

        // 2. Walk through preparation steps
        await runPreparationSequence((step) => {
          if (cancelled.current) return;
          store.advanceStep(step);
        });

        if (cancelled.current) return;

        // 3. Mark preparation complete
        store.completePreparation();
      } catch {
        if (!cancelled.current) {
          store.setPreparationError(
            "Something went wrong while preparing your interview. Please try again.",
          );
        }
      }
    }

    run();

    return () => {
      cancelled.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    phase: store.phase,
    preparationStatus: store.preparationStatus,
    currentStep: store.currentStep,
    completedSteps: store.completedSteps,
    preparationError: store.preparationError,
  };
}
