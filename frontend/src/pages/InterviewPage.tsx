import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import socket from "@/socket/socket";
import { useInterviewStore } from "@/store/interview.store";
import {
  initializeInterviewSocketListeners,
  emitStartInterview,
} from "@/services/interviewSocket.service";
import { interviewAudioPlayer } from "@/services/interviewAudioPlayer.service";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import {
  InterviewLobby,
  InterviewPreparation,
  AIOrb,
  InterviewHeader,
  QuestionDisplay,
  CandidateResponseArea,
  InterviewControls,
  EndInterviewDialog,
  CompletionScreen,
} from "@/components/interview";

// ─── Live Interview Room (active interview UI) ──────────────

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
    clearCurrentAnswer,
    mode,
    setMode,
    isListening,
    interimTranscript,
    speechError,
    isSpeechSupported,
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
    canReplayAudio,
    isReplayingAudio,
    replayAudio,
    stopReplayAudio,
    isAudioStreaming,
  } = useInterviewSession();

  return (
    <div className="relative flex h-dvh max-h-dvh flex-col bg-[#060813] text-slate-100 antialiased overflow-hidden select-none">
      {/* ── Background Subtle Ambient Glows ── */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-10 bottom-10 h-[300px] w-[300px] rounded-full bg-cyan-600/5 blur-[100px]"
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
      <main className="relative z-10 flex flex-1 flex-col items-center px-3 sm:px-4 py-1.5 sm:py-2 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between min-h-0 gap-2 sm:gap-3">
          {/* Top Section: AI Orb & Spoken Question */}
          <div className="flex flex-col items-center justify-center w-full gap-2 sm:gap-2.5 shrink-0 my-auto">
            {/* AI Orb - responsive clamp keeps it large on desktop while fitting laptops */}
            <div className="relative flex items-center justify-center shrink-0">
              <AIOrb state={orbState} size="clamp(185px, 24vh, 275px)" />
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
                canReplayAudio={canReplayAudio}
                isReplayingAudio={isReplayingAudio}
                onReplayAudio={replayAudio}
                onStopReplayAudio={stopReplayAudio}
                isAudioStreaming={isAudioStreaming}
              />
            )}
          </div>

          {/* Bottom Section: Response Area & Controls Dock (Grouped together to prevent any overlap) */}
          <div className="flex flex-col items-center w-full max-w-2xl gap-2 sm:gap-2.5 shrink-0 mt-auto pb-1 z-20">
            <CandidateResponseArea
              orbState={orbState}
              status={status}
              mode={mode}
              onSelectMode={setMode}
              isListening={isListening}
              interimTranscript={interimTranscript}
              isSpeechSupported={isSpeechSupported}
              speechError={speechError}
              answer={typeof answer === "string" ? answer : ""}
              setAnswer={setAnswer}
              onClearAnswer={clearCurrentAnswer}
              onSubmitAnswer={submitCurrentAnswer}
              formattedAnswerTime={formattedAnswerTime}
              error={error}
            />

            <InterviewControls
              orbState={orbState}
              status={status}
              mode={mode}
              isListening={isListening}
              hasAnswer={typeof answer === "string" && Boolean(answer.trim())}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              onToggleListening={toggleListening}
              onEndInterview={() => setIsEndDialogOpen(true)}
            />
          </div>
        </div>
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
// Always mounts on /interview. Owns the socket listener lifecycle.
// Does NOT auto-emit interview:start — waits for the user to click Start.

export function InterviewPage() {
  const navigate = useNavigate();
  const status = useInterviewStore((s) => s.status);
  const currentQuestion = useInterviewStore((s) => s.currentQuestion);
  const dsaProblem = useInterviewStore((s) => s.dsaProblem);

  // ── Auto-redirect to DSA route when DSA problem arrives ──
  useEffect(() => {
    if (dsaProblem) {
      navigate("/interview/dsa");
    }
  }, [dsaProblem, navigate]);

  useEffect(() => {
    const handleNav = (e: Event) => {
      const custom = e as CustomEvent<{ path: string }>;
      if (custom?.detail?.path) {
        navigate(custom.detail.path);
      }
    };
    window.addEventListener("interview:navigate", handleNav);
    return () => window.removeEventListener("interview:navigate", handleNav);
  }, [navigate]);

  const hasStartedRef = useRef(false);

  // ── Register socket listeners on mount (but do NOT emit start) ──
  useEffect(() => {
    const cleanupListeners = initializeInterviewSocketListeners();

    // Connection-level error/disconnect logging (dev only)
    const handleConnectError = (err: Error) => {
      if (import.meta.env.DEV) {
        console.error("[InterviewSocket] connect_error:", err.message);
      }
      useInterviewStore
        .getState()
        .setError("SOCKET_CONNECTION_FAILED", err.message || "Failed to connect to interview server.");
    };

    const handleDisconnect = (reason: string) => {
      if (import.meta.env.DEV) {
        console.warn("[InterviewSocket] disconnected:", reason);
      }
    };

    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);

    return () => {
      cleanupListeners();
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      hasStartedRef.current = false;
    };
  }, []);

  // ── User clicks Start Interview ──
  const handleStartInterview = useCallback(() => {
    if (hasStartedRef.current) return; // guard against double-click / StrictMode
    hasStartedRef.current = true;

    if (import.meta.env.DEV) {
      console.log("[InterviewPage] handleStartInterview invoked");
    }

    // Initialize AudioContext directly inside user click gesture to unlock browser audio
    interviewAudioPlayer.initialize().catch((err) => {
      console.warn("[InterviewPage] AudioPlayer init error on user gesture:", err);
    });

    emitStartInterview();
  }, []);

  // ── Retry after error (before first question) ──
  const handleRetryStart = useCallback(() => {
    hasStartedRef.current = false;
    useInterviewStore.getState().setStatus("idle");
    interviewAudioPlayer.initialize().catch((err) => {
      console.warn("[InterviewPage] AudioPlayer init error on retry:", err);
    });
    // Let user click Start again — don't auto-emit
  }, []);

  const handleBackToSetup = useCallback(() => {
    useInterviewStore.getState().resetInterview();
    navigate("/dashboard/new");
  }, [navigate]);

  // ── Determine which view to render ──
  const isCompleted = status === "completed";
  const isLive = status === "active" || status === "submitting";
  const isPreparing =
    status === "connecting" || status === "starting" || status === "waiting";
  const isErrorBeforeQuestion = status === "error" && currentQuestion === null;
  const isErrorDuringInterview = status === "error" && currentQuestion !== null;

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
      ) : isLive || isErrorDuringInterview ? (
        <motion.div
          key="live"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="min-h-dvh"
        >
          <LiveInterviewRoom />
        </motion.div>
      ) : isPreparing || isErrorBeforeQuestion ? (
        <motion.div
          key="preparation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <InterviewPreparation
            onRetry={handleRetryStart}
            onBack={handleBackToSetup}
          />
        </motion.div>
      ) : (
        <motion.div
          key="lobby"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <InterviewLobby onStart={handleStartInterview} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InterviewPage;
