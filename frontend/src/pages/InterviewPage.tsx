import { useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useInterviewStore } from "@/store/interview.store";
import { useInterviewPreparation } from "@/hooks/useInterviewPreparation";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import {
  PreparationScreen,
  AIOrb,
  InterviewHeader,
  QuestionDisplay,
  InterviewControls,
  CompletionScreen,
} from "@/components/interview";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Ready Transition (brief flash between prep & live) ─────

function ReadyTransition({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background">
      <div
        className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[90px]"
        aria-hidden="true"
      />
      <motion.div
        initial={reduced ? undefined : { scale: 0.85, opacity: 0 }}
        animate={reduced ? undefined : { scale: 1, opacity: 1 }}
        exit={reduced ? undefined : { scale: 1.05, opacity: 0 }}
        transition={{ duration: 0.5, ease }}
        className="relative flex flex-col items-center gap-4"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <CheckCircle2 className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-text">Interview ready</h2>
      </motion.div>
    </div>
  );
}

// ── Live Interview Screen ──────────────────────────────────

function LiveInterview() {
  const {
    orbState,
    currentQuestion,
    interviewType,
    toggleListening,
    skipQuestion,
    endInterview,
  } = useInterviewSession();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <InterviewHeader
        interviewType={interviewType}
        questionNumber={currentQuestion?.questionNumber ?? 1}
        totalQuestions={currentQuestion?.totalQuestions ?? 5}
      />

      <main className="flex flex-1 flex-col items-center justify-center gap-14 px-4 py-8 sm:gap-16 sm:py-12">
        <AIOrb state={orbState} />

        {currentQuestion && (
          <QuestionDisplay
            question={currentQuestion.text}
            orbState={orbState}
          />
        )}

        <InterviewControls
          orbState={orbState}
          onToggleListening={toggleListening}
          onSkipQuestion={skipQuestion}
          onEndInterview={endInterview}
        />
      </main>
    </div>
  );
}

// ── Main Page Orchestrator ─────────────────────────────────

export function InterviewPage() {
  const phase = useInterviewStore((s) => s.phase);
  const preparationStatus = useInterviewStore((s) => s.preparationStatus);
  const setPhase = useInterviewStore((s) => s.setPhase);

  // Reset store when this page mounts for the first time
  useEffect(() => {
    useInterviewStore.getState().reset();
    useInterviewStore.getState().startPreparation();
  }, []);

  const { currentStep, completedSteps, preparationError } =
    useInterviewPreparation();

  // When preparation completes, transition to READY_TRANSITION
  useEffect(() => {
    if (preparationStatus === "READY" && phase === "PREPARATION") {
      setPhase("READY_TRANSITION");
    }
  }, [preparationStatus, phase, setPhase]);

  const handleReadyComplete = useCallback(() => {
    setPhase("LIVE");
  }, [setPhase]);

  return (
    <AnimatePresence mode="wait">
      {phase === "PREPARATION" && (
        <motion.div
          key="preparation"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PreparationScreen
            currentStep={currentStep}
            completedSteps={completedSteps}
            preparationError={preparationError}
          />
        </motion.div>
      )}

      {phase === "READY_TRANSITION" && (
        <motion.div
          key="ready"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ReadyTransition onComplete={handleReadyComplete} />
        </motion.div>
      )}

      {phase === "LIVE" && (
        <motion.div
          key="live"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="min-h-dvh"
        >
          <LiveInterview />
        </motion.div>
      )}

      {phase === "COMPLETED" && (
        <motion.div
          key="completed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          <CompletionScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
