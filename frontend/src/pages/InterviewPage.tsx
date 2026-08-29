import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInterviewStore } from "@/store/interview.store";
import { useInterviewSocket } from "@/hooks/useInterviewSocket";
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

// ─── Live Interview Room ─────────────────────────────────────

function LiveInterviewRoom() {
  const {
    status,
    orbState,
    currentRoundNumber,
    currentQuestionNumber,
    currentDifficulty,
    currentQuestion,
    answer,
    setAnswer,
    error,
    role,
    interviewType,
    formattedTime,
    formattedAnswerTime,
    isMuted,
    toggleMute,
    isEndDialogOpen,
    setIsEndDialogOpen,
    toggleListening,
    submitCurrentAnswer,
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

      {/* ── Top Bar ── */}
      <InterviewHeader
        interviewType={interviewType}
        role={role}
        difficulty={currentDifficulty}
        roundNumber={currentRoundNumber}
        questionNumber={currentQuestionNumber}
        status={status}
        formattedTime={formattedTime}
      />

      {/* ── Central AI Interviewer & Response Form ── */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-between px-4 py-6 sm:py-8">
        <div className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center gap-6 sm:gap-8">
          {/* AI Orb */}
          <div className="relative flex items-center justify-center">
            <AIOrb state={orbState} />
          </div>

          {/* Current Question */}
          {currentQuestion && (
            <QuestionDisplay
              question={currentQuestion.text}
              topic={currentQuestion.topic}
              roundNumber={currentRoundNumber}
              questionNumber={currentQuestionNumber}
              difficulty={currentDifficulty}
              orbState={orbState}
            />
          )}

          {/* Candidate Response Area */}
          <CandidateResponseArea
            orbState={orbState}
            status={status}
            answer={answer}
            setAnswer={setAnswer}
            onSubmitAnswer={submitCurrentAnswer}
            formattedAnswerTime={formattedAnswerTime}
            error={error}
          />
        </div>

        {/* ── Bottom Controls ── */}
        <InterviewControls
          orbState={orbState}
          status={status}
          hasAnswer={Boolean(answer.trim())}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onToggleListening={toggleListening}
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
  const currentQuestion = useInterviewStore((s) => s.currentQuestion);
  const startInterview = useInterviewStore((s) => s.startInterview);

  const { startInterview: emitStart } = useInterviewSocket();

  // If page is loaded directly in idle state, start interview
  useEffect(() => {
    if (status === "idle") {
      startInterview();
      emitStart();
    }
  }, [status, startInterview, emitStart]);

  // Determine active view mode
  const isCompleted = status === "completed";
  const isLive = (status === "active" || status === "submitting") || (status === "error" && currentQuestion !== null);

  return (
    <AnimatePresence mode="wait">
      {isCompleted ? (
        <motion.div
          key="completed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          <CompletionScreen />
        </motion.div>
      ) : isLive ? (
        <motion.div
          key="live"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="min-h-dvh"
        >
          <LiveInterviewRoom />
        </motion.div>
      ) : (
        <motion.div
          key="preparation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PreparationScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

