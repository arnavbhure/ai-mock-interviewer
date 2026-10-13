import { useCallback, useEffect, useState } from "react";
import { useInterviewStore } from "@/store/interview.store";
import type { OrbState } from "@/types/interview.types";
import type { CandidateInputMode } from "@/types/speechRecognition.types";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
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

  // ─── Input Mode State (Voice default if supported, else Text) ───
  const [mode, setMode] = useState<CandidateInputMode>(() => {
    if (typeof window === "undefined") return "text";
    const hasSupport = Boolean(
      window.SpeechRecognition || window.webkitSpeechRecognition,
    );
    return hasSupport ? "voice" : "text";
  });

  // ─── Accumulate final spoken chunks safely ───────────────────
  const handleFinalSpeechSegment = useCallback(
    (finalChunk: string) => {
      const cleanChunk = finalChunk.trim();
      if (!cleanChunk) return;

      setCandidateAnswer((prev) => {
        const prevStr = typeof prev === "string" ? prev : "";
        const prevTrimmed = prevStr.trim();
        if (!prevTrimmed) return cleanChunk;
        return `${prevTrimmed} ${cleanChunk}`;
      });
    },
    [setCandidateAnswer],
  );

  // ─── Hoisted Speech Recognition Hook ──────────────────────────
  const speech = useSpeechRecognition({
    lang: "en-US",
    disabled: status === "submitting" || mode !== "voice",
    onFinalResult: handleFinalSpeechSegment,
  });

  // ─── Stop listening if interview advances or submits ───────────
  useEffect(() => {
    if (status === "submitting" || status === "completed") {
      if (speech.isListening) {
        speech.stopListening();
      }
    }
  }, [status, speech]);

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
    if (
      status === "starting" ||
      status === "waiting" ||
      status === "connecting" ||
      status === "preparing"
    ) {
      return "THINKING";
    }
    if (status === "submitting") return "PROCESSING";
    if (status === "active") {
      if (speech.isListening) return "LISTENING";
      return isSpeakingPhase ? "AI_SPEAKING" : "LISTENING";
    }
    return "idle";
  })();

  // ─── User Actions ─────────────────────────────────────────────

  const safeAnswer =
    typeof candidateAnswer === "string"
      ? candidateAnswer
      : typeof answer === "string"
        ? answer
        : "";

  const handleSetAnswer = useCallback(
    (newAnswer: string | ((prev: string) => string)) => {
      setCandidateAnswer(newAnswer);
    },
    [setCandidateAnswer],
  );

  const selectMode = useCallback(
    (newMode: CandidateInputMode) => {
      if (newMode === mode) return;
      if (newMode === "voice" && !speech.isSupported) return;
      if (speech.isListening) {
        speech.stopListening();
      }
      setMode(newMode);
    },
    [mode, speech],
  );

  const toggleListening = useCallback(() => {
    if (status === "submitting") return;
    if (isSpeakingPhase) {
      setIsSpeakingPhase(false);
    }
    if (mode !== "voice") {
      setMode("voice");
    }
    if (speech.isListening) {
      speech.stopListening();
    } else {
      speech.startListening();
    }
  }, [status, isSpeakingPhase, mode, speech]);

  const clearCurrentAnswer = useCallback(() => {
    if (status === "submitting") return;
    if (speech.isListening) {
      speech.stopListening();
    }
    setCandidateAnswer("");
  }, [status, speech, setCandidateAnswer]);

  const submitCurrentAnswer = useCallback(() => {
    if (speech.isListening) {
      speech.stopListening();
    }
    const rawAns =
      typeof candidateAnswer === "string"
        ? candidateAnswer
        : typeof answer === "string"
          ? answer
          : "";
    const trimmed = rawAns.trim();
    if (!trimmed || status === "submitting") return;

    emitSubmitAnswer(trimmed);
  }, [candidateAnswer, answer, status, speech]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  }, []);

  const confirmEndInterview = useCallback(() => {
    if (speech.isListening) {
      speech.stopListening();
    }
    setIsEndDialogOpen(false);
    resetInterview();
  }, [speech, resetInterview]);

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
    answer: safeAnswer,
    setAnswer: handleSetAnswer,
    clearCurrentAnswer,
    mode,
    setMode: selectMode,
    speech,
    isListening: speech.isListening,
    interimTranscript: speech.interimTranscript,
    speechError: speech.error,
    isSpeechSupported: speech.isSupported,
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
