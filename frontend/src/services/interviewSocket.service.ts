import socket from "@/socket/socket";
import { useInterviewStore } from "@/store/interview.store";
import { toastError } from "@/components/ui/toast";
import type {
  QuestionPayload,
  CompletedPayload,
  ErrorPayload,
} from "@/types/interview.types";

let isInitialized = false;

// ─── Named Event Handlers (Safe references for cleanup) ───────

const handleQuestion = (data: QuestionPayload) => {
  useInterviewStore.getState().setQuestion(data);
};

const handleCompleted = (data: CompletedPayload) => {
  useInterviewStore.getState().setCompleted(data);
};

const handleError = (data: ErrorPayload) => {
  useInterviewStore.getState().setError(data.code, data.message);
  if (data?.message) {
    toastError(data.message);
  } else if (data?.code) {
    toastError(`Interview Error: ${data.code}`);
  }
};

// ─── Socket Listener Lifecycle Management ─────────────────────

/**
 * Registers Socket.IO event listeners for the real-time interview session.
 * Safe to call across React component lifecycles — guards against duplicate listeners.
 *
 * @returns Cleanup function to remove the listeners
 */
export function initializeInterviewSocketListeners(): () => void {
  if (!socket.connected) {
    socket.connect();
  }

  if (!isInitialized) {
    socket.on("interview:question", handleQuestion);
    socket.on("interview:completed", handleCompleted);
    socket.on("interview:error", handleError);
    isInitialized = true;
  }

  return cleanupInterviewSocketListeners;
}

/**
 * Removes registered Socket.IO interview listeners to prevent duplicate triggers.
 */
export function cleanupInterviewSocketListeners(): void {
  socket.off("interview:question", handleQuestion);
  socket.off("interview:completed", handleCompleted);
  socket.off("interview:error", handleError);
  isInitialized = false;
}

// ─── Socket Command Emitters (Frontend -> Backend) ───────────

/**
 * Emits "interview:start" to begin the interview session on the backend.
 * Updates Zustand status to "starting".
 * Does NOT send an interviewId or any payload (backend identifies via authenticated socket).
 */
export function emitStartInterview(): void {
  if (!socket.connected) {
    socket.connect();
  }
  useInterviewStore.getState().startInterview();
  socket.emit("interview:start");
}

/**
 * Emits "interview:answer" with the candidate's response string.
 * Validates non-empty input and updates Zustand status to "submitting".
 *
 * @param answer - The candidate's answer string
 * @returns boolean indicating if the payload was valid and emitted
 */
export function emitSubmitAnswer(answer: string): boolean {
  const trimmed = answer.trim();
  if (!trimmed) return false;

  if (!socket.connected) {
    socket.connect();
  }

  useInterviewStore.getState().setCandidateAnswer(trimmed);
  useInterviewStore.getState().setSubmitting();
  socket.emit("interview:answer", {
    answer: trimmed,
  });
  return true;
}

