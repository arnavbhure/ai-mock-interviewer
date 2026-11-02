import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "@/store/interview.store";
import type { OrbState } from "@/types/interview.types";
import type { CandidateInputMode } from "@/types/speechRecognition.types";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { emitSubmitAnswer } from "@/services/interviewSocket.service";
import { interviewAudioPlayer } from "@/services/interviewAudioPlayer.service";
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
    aiAudioStatus,
    canReplayAudio,
    isReplayingAudio,
    setCandidateAnswer,
    setSubmitting,
    setAIState,
    setAIAudioStatus,
    setCanReplayAudio,
    setIsReplayingAudio,
    resetInterview,
  } = useInterviewStore();

  const navigate = useNavigate();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [answerSeconds, setAnswerSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false);
  const [isSpeakingPhase, setIsSpeakingPhase] = useState(true);
  const audioInitializedRef = useRef(false);

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

  // ─── Audio Player Lifecycle ──────────────────────────────────
  // Initialize AudioContext early (called from handleStartInterview user gesture)
  // and register callbacks that sync store state
  useEffect(() => {
    // Register audio player callbacks
    interviewAudioPlayer.setCallbacks({
      onStatusChange: (audioStatus) => {
        setAIAudioStatus(audioStatus);

        // When playback starts, ensure AI state is "speaking"
        if (audioStatus === "playing") {
          setAIState("speaking");
          setIsSpeakingPhase(true);
        }
      },
      onPlaybackComplete: () => {
        if (import.meta.env.DEV) {
          console.log("[useInterviewSession] AI audio playback complete → candidate turn");
        }
        setAIAudioStatus("idle");
        setAIState("listening");
        setIsSpeakingPhase(false);
        setCanReplayAudio(true);
      },
      onAudioReadyToReplay: (questionId) => {
        if (import.meta.env.DEV) {
          console.log("[useInterviewSession] Audio ready to replay for:", questionId);
        }
        setCanReplayAudio(true);
      },
      onReplayStatusChange: (isReplaying) => {
        setIsReplayingAudio(isReplaying);
      },
      onError: (message) => {
        console.error("[useInterviewSession] Audio error:", message);
        setAIAudioStatus("error");
        // Fallback: transition to candidate turn even on audio error
        setIsSpeakingPhase(false);
        setCanReplayAudio(true);
      },
    });

    return () => {
      interviewAudioPlayer.setCallbacks({});
    };
  }, [setAIAudioStatus, setAIState, setCanReplayAudio, setIsReplayingAudio]);

  // Initialize AudioContext when interview becomes active
  useEffect(() => {
    if (
      (status === "starting" || status === "waiting" || status === "active") &&
      !audioInitializedRef.current
    ) {
      interviewAudioPlayer.initialize().then(() => {
        audioInitializedRef.current = true;
        if (import.meta.env.DEV) {
          console.log("[useInterviewSession] AudioContext initialized for session");
        }
      });
    }
  }, [status]);

  // Dispose audio player when interview completes or resets
  useEffect(() => {
    if (status === "idle" || status === "completed") {
      if (audioInitializedRef.current) {
        interviewAudioPlayer.dispose();
        audioInitializedRef.current = false;
      }
    }
  }, [status]);

  // Sync mute state with audio player
  useEffect(() => {
    interviewAudioPlayer.setVolume(isMuted ? 0 : 1);
  }, [isMuted]);

  // ─── AI Speech -> Candidate Turn Transition Timer ────────────
  // Fallback timer: if no TTS audio arrives, use the 3.5s timer
  useEffect(() => {
    if (!currentQuestion) return;

    const startTimer = setTimeout(() => {
      setIsSpeakingPhase(true);
    }, 0);

    // Fallback timer: if audio is idle or error, transition after 3.5s
    const fallbackTimer = setTimeout(() => {
      const currentAudioStatus = useInterviewStore.getState().aiAudioStatus;
      if (currentAudioStatus === "idle" || currentAudioStatus === "error") {
        setIsSpeakingPhase(false);
        setCanReplayAudio(true);
      }
    }, 3500);

    // Hard safety watchdog: no speaking phase should ever exceed 12 seconds
    // Guarantees UI never hangs even on dropped packets or audio issues
    const safetyWatchdog = setTimeout(() => {
      const currentAudioStatus = useInterviewStore.getState().aiAudioStatus;
      if (currentAudioStatus !== "idle") {
        if (import.meta.env.DEV) {
          console.warn(
            "[useInterviewSession] Hard safety watchdog (12s) reached, releasing speaking turn to candidate",
          );
        }
        interviewAudioPlayer.stopPlayback();
        setAIAudioStatus("idle");
        setAIState("listening");
        setIsSpeakingPhase(false);
        setCanReplayAudio(true);
      }
    }, 12000);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(fallbackTimer);
      clearTimeout(safetyWatchdog);
    };
  }, [currentQuestion, setAIAudioStatus, setAIState, setCanReplayAudio]);

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
      // If AI audio is actively playing, buffering, draining, or replaying, show speaking state
      if (
        isReplayingAudio ||
        aiAudioStatus === "playing" ||
        aiAudioStatus === "buffering" ||
        aiAudioStatus === "draining"
      ) {
        return "AI_SPEAKING";
      }
      if (speech.isListening) return "LISTENING";
      return isSpeakingPhase ? "AI_SPEAKING" : "LISTENING";
    }
    return "idle";
  })();

  // ─── Audio Replay Controls ────────────────────────────────────

  const stopReplayAudio = useCallback(() => {
    interviewAudioPlayer.stopReplay();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsReplayingAudio(false);
  }, [setIsReplayingAudio]);

  const replayAudio = useCallback(async () => {
    // If candidate microphone is listening, stop it first
    if (speech.isListening) {
      speech.stopListening();
    }
    const currentQ = useInterviewStore.getState().currentQuestion;
    const questionId = currentQ?.id || "";
    const played = await interviewAudioPlayer.replayAudio(questionId);

    // If backend TTS PCM was unavailable or empty, fallback to browser SpeechSynthesis
    if (!played && currentQ?.text && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQ.text);
      utterance.onend = () => setIsReplayingAudio(false);
      utterance.onerror = () => setIsReplayingAudio(false);
      setIsReplayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  }, [speech, setIsReplayingAudio]);

  // ─── User Actions ─────────────────────────────────────────────

  const safeAnswer =
    typeof candidateAnswer === "string"
      ? candidateAnswer
      : typeof answer === "string"
        ? answer
        : "";

  const handleSetAnswer = useCallback(
    (newAnswer: string | ((prev: string) => string)) => {
      if (isSpeakingPhase) {
        setIsSpeakingPhase(false);
        interviewAudioPlayer.stopPlayback();
        setAIAudioStatus("idle");
        setAIState("listening");
        setCanReplayAudio(true);
      }
      setCandidateAnswer(newAnswer);
    },
    [isSpeakingPhase, setCandidateAnswer, setAIAudioStatus, setAIState, setCanReplayAudio],
  );

  const selectMode = useCallback(
    (newMode: CandidateInputMode) => {
      if (newMode === mode) return;
      stopReplayAudio();
      if (newMode === "voice" && !speech.isSupported) return;
      if (speech.isListening) {
        speech.stopListening();
      }
      setMode(newMode);
    },
    [mode, speech, stopReplayAudio],
  );

  const toggleListening = useCallback(() => {
    if (status === "submitting") return;
    stopReplayAudio();
    if (isSpeakingPhase) {
      setIsSpeakingPhase(false);
      // Stop audio playback if user wants to start speaking
      interviewAudioPlayer.stopPlayback();
      setAIAudioStatus("idle");
      setAIState("listening");
      setCanReplayAudio(true);
    }
    if (mode !== "voice") {
      setMode("voice");
    }
    if (speech.isListening) {
      speech.stopListening();
    } else {
      speech.startListening();
    }
  }, [status, isSpeakingPhase, mode, speech, stopReplayAudio, setAIAudioStatus, setAIState, setCanReplayAudio]);

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
    // Stop any ongoing audio playback or replay when candidate submits
    stopReplayAudio();
    interviewAudioPlayer.stopPlayback();

    const rawAns =
      typeof candidateAnswer === "string"
        ? candidateAnswer
        : typeof answer === "string"
          ? answer
          : "";
    const trimmed = rawAns.trim();
    if (!trimmed || status === "submitting") return;

    emitSubmitAnswer(trimmed);
  }, [candidateAnswer, answer, status, speech, stopReplayAudio]);

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
    // Stop audio and dispose player
    stopReplayAudio();
    interviewAudioPlayer.stopPlayback();
    setIsEndDialogOpen(false);
    resetInterview();
    navigate("/dashboard");
  }, [speech, resetInterview, stopReplayAudio, navigate]);

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
    aiAudioStatus,
    canReplayAudio,
    isReplayingAudio,
    replayAudio,
    stopReplayAudio,
    isAudioStreaming:
      aiAudioStatus === "buffering" ||
      aiAudioStatus === "playing" ||
      aiAudioStatus === "draining",
  };
}
