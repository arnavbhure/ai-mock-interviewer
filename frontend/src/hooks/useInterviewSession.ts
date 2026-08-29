import { useCallback, useEffect, useState } from "react";
import { useInterviewStore } from "@/store/interview.store";
import type { OrbState } from "@/types/interview.types";
import { emitSubmitAnswer } from "@/services/interviewSocket.service";
import { MOCK_INTERVIEW_CONFIG } from "@/data/interview.mock";

export function useInterviewSession() {
  const {
    interviewId,
    status,
    roundNumber,
    questionNumber,
    difficulty,
    role,
    currentQuestion,
    candidateAnswer,
    answer,
    evaluation,
    finalEvaluation,
    error,
    setCandidateAnswer,
    setSubmitting,
    resetInterview,
  } = useInterviewStore();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [answerSeconds, setAnswerSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false);
  const [isSpeakingPhase, setIsSpeakingPhase] = useState(true);

  // ─── AI Speech -> Candidate Turn Transition Timer ────────────
  useEffect(() => {
    if (!currentQuestion) return;

    // AI speaks initially for ~3.5s upon question arrival, then candidate turns
    const startTimer = setTimeout(() => {
      setIsSpeakingPhase(true);
    }, 0);

    const endTimer = setTimeout(() => {
      setIsSpeakingPhase(false);
    }, 3500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [currentQuestion]);

  // ─── Elapsed interview timer ─────────────────────────────────
  useEffect(() => {
    if (status !== "active" && status !== "submitting") return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  // ─── Answer duration timer (active during candidate turn) ────
  useEffect(() => {
    if (status !== "active" || isSpeakingPhase) return;

    const timer = setInterval(() => {
      setAnswerSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [status, isSpeakingPhase]);

  // ─── Derived Orb State ───────────────────────────────────────
  const orbState: OrbState = (() => {
    if (status === "starting") return "THINKING";
    if (status === "submitting") return "PROCESSING";
    if (status === "active") {
      return isSpeakingPhase ? "AI_SPEAKING" : "LISTENING";
    }
    return "idle";
  })();

  // ─── User Actions ─────────────────────────────────────────────

  const handleSetAnswer = useCallback(
    (newAnswer: string) => {
      setCandidateAnswer(newAnswer);
    },
    [setCandidateAnswer],
  );

  const submitCurrentAnswer = useCallback(() => {
    const currentAns = candidateAnswer || answer;
    const trimmed = currentAns.trim();
    if (!trimmed || status === "submitting") return;

    emitSubmitAnswer(trimmed);
  }, [candidateAnswer, answer, status]);

  const toggleListening = useCallback(() => {
    if (isSpeakingPhase) {
      // Candidate wants to skip AI speech and start answering immediately
      setIsSpeakingPhase(false);
    } else if ((candidateAnswer || answer).trim()) {
      // Candidate finished answering and submits
      submitCurrentAnswer();
    }
  }, [isSpeakingPhase, candidateAnswer, answer, submitCurrentAnswer]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const confirmEndInterview = useCallback(() => {
    setIsEndDialogOpen(false);
    resetInterview();
  }, [resetInterview]);

  const formattedTime = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:${String(
    elapsedSeconds % 60,
  ).padStart(2, "0")}`;

  const formattedAnswerTime = `${String(Math.floor(answerSeconds / 60)).padStart(2, "0")}:${String(
    answerSeconds % 60,
  ).padStart(2, "0")}`;

  return {
    interviewId,
    status,
    orbState,
    currentRoundNumber: roundNumber,
    currentQuestionNumber: questionNumber,
    currentDifficulty: difficulty ?? MOCK_INTERVIEW_CONFIG.difficulty,
    currentQuestion,
    answer: candidateAnswer || answer,
    setAnswer: handleSetAnswer,
    setSubmitting,
    finalEvaluation: evaluation ?? finalEvaluation,
    error,
    role: role || MOCK_INTERVIEW_CONFIG.role,
    interviewType: MOCK_INTERVIEW_CONFIG.type,
    elapsedSeconds,
    formattedTime,
    answerSeconds,
    formattedAnswerTime,
    isMuted,
    toggleMute,
    isEndDialogOpen,
    setIsEndDialogOpen,
    toggleListening,
    submitCurrentAnswer,
    confirmEndInterview,
  };
}

