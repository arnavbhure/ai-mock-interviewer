import socket from "@/socket/socket";
import { useInterviewStore } from "@/store/interview.store";
import { toastError } from "@/components/ui/toast";
import { interviewAudioPlayer } from "@/services/interviewAudioPlayer.service";
import type {
  QuestionPayload,
  CompletedPayload,
  ErrorPayload,
  AudioStartPayload,
  AudioChunkPayload,
  AudioEndPayload,
  AudioErrorPayload,
} from "@/types/interview.types";

let isInitialized = false;

// ─── Named Event Handlers (Safe references for cleanup) ───────

const handleQuestion = (data: QuestionPayload) => {
  if (import.meta.env.DEV) {
    console.log("[InterviewSocket] interview:question received", data);
  }
  useInterviewStore.getState().setQuestion(data);
};

const handleCompleted = (data: CompletedPayload) => {
  if (import.meta.env.DEV) {
    console.log("[InterviewSocket] interview:completed received", data);
  }
  useInterviewStore.getState().setCompleted(data);
};

const handleError = (data: ErrorPayload) => {
  if (import.meta.env.DEV) {
    console.error("[InterviewSocket] interview:error received", data);
  }
  useInterviewStore.getState().setError(data.code, data.message);
  if (data?.message) {
    toastError(data.message);
  } else if (data?.code) {
    toastError(`Interview Error: ${data.code}`);
  }
};

// ─── Audio Streaming Event Handlers ──────────────────────────

const handleAudioStart = (data: AudioStartPayload) => {
  if (import.meta.env.DEV) {
    console.log("[InterviewSocket] interview:audio:start", data);
  }
  useInterviewStore.getState().setAIAudioStatus("buffering");
  useInterviewStore.getState().setAIState("speaking");
  interviewAudioPlayer.startStream(data);
};

const handleAudioChunk = (data: AudioChunkPayload) => {
  interviewAudioPlayer.enqueueChunk(data);
};

const handleAudioEnd = (data: AudioEndPayload) => {
  if (import.meta.env.DEV) {
    console.log("[InterviewSocket] interview:audio:end", data);
  }
  interviewAudioPlayer.endStream(data);
};

const handleAudioError = (data: AudioErrorPayload) => {
  if (import.meta.env.DEV) {
    console.error("[InterviewSocket] interview:audio:error", data);
  }
  interviewAudioPlayer.handleStreamError(data);
  useInterviewStore.getState().setAIAudioStatus("error");
};

// ─── Socket Listener Lifecycle Management ─────────────────────

/**
 * Registers Socket.IO event listeners for the real-time interview session.
 * Safe to call across React component lifecycles — guards against duplicate listeners.
 *
 * @returns Cleanup function to remove the listeners
 */
export function initializeInterviewSocketListeners(): () => void {
  if (!isInitialized) {
    if (import.meta.env.DEV) {
      console.log("[InterviewSocket] initializing listeners");
    }
    socket.on("interview:question", handleQuestion);
    socket.on("interview:completed", handleCompleted);
    socket.on("interview:error", handleError);

    // Audio streaming listeners
    socket.on("interview:audio:start", handleAudioStart);
    socket.on("interview:audio:chunk", handleAudioChunk);
    socket.on("interview:audio:end", handleAudioEnd);
    socket.on("interview:audio:error", handleAudioError);

    isInitialized = true;
  }

  return cleanupInterviewSocketListeners;
}

/**
 * Removes registered Socket.IO interview listeners to prevent duplicate triggers.
 */
export function cleanupInterviewSocketListeners(): void {
  if (import.meta.env.DEV) {
    console.log("[InterviewSocket] cleaning up listeners");
  }
  socket.off("interview:question", handleQuestion);
  socket.off("interview:completed", handleCompleted);
  socket.off("interview:error", handleError);

  // Audio streaming listeners
  socket.off("interview:audio:start", handleAudioStart);
  socket.off("interview:audio:chunk", handleAudioChunk);
  socket.off("interview:audio:end", handleAudioEnd);
  socket.off("interview:audio:error", handleAudioError);

  isInitialized = false;
}

/**
 * Emits "interview:start" to begin the interview session on the backend.
 * Ensures the socket connection is established and listeners are active before emitting.
 * Does NOT send an interviewId or any payload (backend identifies via authenticated socket).
 */
export function emitStartInterview(): void {
  // 1. Ensure listeners are attached first
  initializeInterviewSocketListeners();

  const doEmit = () => {
    if (import.meta.env.DEV) {
      console.log("[InterviewSocket] emitting interview:start, socket.id:", socket.id);
    }
    useInterviewStore.getState().setStarting();
    socket.emit("interview:start");
    useInterviewStore.getState().setWaiting();
  };

  if (socket.connected) {
    if (import.meta.env.DEV) {
      console.log("[InterviewSocket] already connected, socket.id:", socket.id);
    }
    doEmit();
  } else {
    if (import.meta.env.DEV) {
      console.log("[InterviewSocket] connecting...");
    }
    useInterviewStore.getState().setConnecting();
    socket.connect();
    socket.once("connect", () => {
      if (import.meta.env.DEV) {
        console.log("[InterviewSocket] connected:", socket.id);
      }
      doEmit();
    });
  }
}

/**
 * Emits "interview:answer" with the candidate's response string.
 * Validates non-empty input and updates Zustand status to "submitting".
 * Prevents duplicate answer submissions while already in "submitting" state.
 *
 * @param answer - The candidate's answer string
 * @returns boolean indicating if the payload was valid and emitted
 */
export function emitSubmitAnswer(answer: string): boolean {
  const trimmed = answer.trim();
  if (!trimmed) return false;

  const currentStatus = useInterviewStore.getState().status;
  if (currentStatus === "submitting") {
    return false; // Prevent duplicate submissions
  }

  useInterviewStore.getState().setSubmitting();

  const doEmit = () => {
    socket.emit("interview:answer", {
      answer: trimmed,
    });
  };

  if (socket.connected) {
    doEmit();
  } else {
    socket.connect();
    socket.once("connect", () => {
      doEmit();
    });
  }

  return true;
}

export default {
  initializeInterviewSocketListeners,
  cleanupInterviewSocketListeners,
  emitStartInterview,
  emitSubmitAnswer,
};
