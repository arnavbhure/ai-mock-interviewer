import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useInterviewStore } from "@/store/interview.store";
import type { InterviewPhase } from "@/types/interview.types";
import { useInterviewPreparation } from "@/hooks/useInterviewPreparation";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import {
  PreparationScreen,
  AIOrb,
  InterviewHeader,
  QuestionDisplay,
  CandidateResponseArea,
  InterviewControls,
  EndInterviewDialog,
  CompletionScreen,
} from "@/components/interview";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Ready Transition (Dark ambient handoff into Live Room) ──

function ReadyTransition({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(onComplete, 1400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#060813] text-white select-none">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/15 blur-[100px]"
        aria-hidden="true"
      />
      <motion.div
        initial={reduced ? undefined : { scale: 0.85, opacity: 0 }}
        animate={reduced ? undefined : { scale: 1, opacity: 1 }}
        exit={reduced ? undefined : { scale: 1.05, opacity: 0 }}
        transition={{ duration: 0.5, ease }}
        className="relative z-10 flex flex-col items-center gap-4 text-center px-4"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-0.5 text-[11px] font-semibold text-indigo-300">
            <Sparkles className="h-3 w-3" />
            <span>INTERVIEW ROOM READY</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Entering live interview
          </h2>
          <p className="text-xs text-slate-400">
            Preparing AI interviewer and audio channel...
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Live Interview Room ─────────────────────────────────────

export function LiveInterviewRoom() {
  const {
    orbState,
    currentQuestion,
    interviewType,
    role,
    difficulty,
    totalQuestions,
    formattedTime,
    formattedAnswerTime,
    isMuted,
    toggleMute,
    candidateTranscript,
    isEndDialogOpen,
    setIsEndDialogOpen,
    toggleListening,
    skipQuestion,
    confirmEndInterview,
  } = useInterviewSession();

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#060813] text-slate-100 antialiased overflow-hidden">
      {/* ── Background Subtle Ambient Glows ── */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-10 bottom-10 h-[350px] w-[350px] rounded-full bg-cyan-600/5 blur-[120px]"
        aria-hidden="true"
      />

      {/* ── A. Top Bar ── */}
      <InterviewHeader
        interviewType={interviewType}
        role={role}
        difficulty={difficulty}
        questionNumber={currentQuestion?.questionNumber ?? 1}
        totalQuestions={totalQuestions}
        formattedTime={formattedTime}
      />

      {/* ── B & C. Central AI Interviewer & Visible Question Area ── */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-between px-4 py-6 sm:py-8">
        <div className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center gap-6 sm:gap-8">
          {/* AI Orb (Visual Centerpiece with WebGL & Stage Lighting) */}
          <div className="relative flex items-center justify-center">
            <AIOrb state={orbState} />
          </div>

          {/* Visible Spoken Question Below Orb */}
          {currentQuestion && (
            <QuestionDisplay
              question={currentQuestion.text}
              topic={currentQuestion.topic}
              questionNumber={currentQuestion.questionNumber}
              totalQuestions={totalQuestions}
              orbState={orbState}
            />
          )}

          {/* Candidate Response & Live Transcript Area */}
          <CandidateResponseArea
            orbState={orbState}
            transcript={candidateTranscript}
            formattedAnswerTime={formattedAnswerTime}
          />
        </div>

        {/* ── D. Bottom Controls Dock ── */}
        <InterviewControls
          orbState={orbState}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onToggleListening={toggleListening}
          onSkipQuestion={skipQuestion}
          onEndInterview={() => setIsEndDialogOpen(true)}
        />
      </main>

      {/* ── End Interview Confirmation Modal ── */}
      <EndInterviewDialog
        isOpen={isEndDialogOpen}
        onClose={() => setIsEndDialogOpen(false)}
        onConfirm={confirmEndInterview}
      />
    </div>
  );
}

// ─── Main Page Orchestrator ─────────────────────────────────

export function InterviewPage() {
  const status = useInterviewStore((s) => s.status);
  const resetStore = useInterviewStore((s) => s.reset);

  const [phase, setPhase] = useState<InterviewPhase>("PREPARATION");

  // Reset store when this page mounts
  useEffect(() => {
    resetStore();
  }, [resetStore]);

  const handlePreparationReady = useCallback(() => {
    setPhase("READY_TRANSITION");
  }, []);

  const { currentStep, completedSteps, preparationError } =
    useInterviewPreparation({ onReady: handlePreparationReady });

  const handleReadyComplete = useCallback(() => {
    setPhase("LIVE");
  }, []);

  // Compute active display phase
  const activePhase: InterviewPhase =
    status === "completed" ? "COMPLETED" : phase;

  return (
    <AnimatePresence mode="wait">
      {activePhase === "PREPARATION" && (
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

      {activePhase === "READY_TRANSITION" && (
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

      {activePhase === "LIVE" && (
        <motion.div
          key="live"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="min-h-dvh"
        >
          <LiveInterviewRoom />
        </motion.div>
      )}

      {activePhase === "COMPLETED" && (
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
