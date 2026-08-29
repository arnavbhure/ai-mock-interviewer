import { useEffect } from "react";
import {
  initializeInterviewSocketListeners,
  cleanupInterviewSocketListeners,
  emitStartInterview,
  emitSubmitAnswer,
} from "@/services/interviewSocket.service";

type UseInterviewSocketOptions = {
  autoStart?: boolean;
};

/**
 * Custom hook to manage the Interview Socket.IO lifecycle cleanly.
 * Attaches question, completed, and error event listeners on mount and removes them on unmount.
 *
 * @param options - Optional configuration, e.g. autoStart to automatically emit "interview:start"
 */
export function useInterviewSocket(options: UseInterviewSocketOptions = {}) {
  const { autoStart = false } = options;

  useEffect(() => {
    const cleanup = initializeInterviewSocketListeners();

    if (autoStart) {
      emitStartInterview();
    }

    return () => {
      cleanup();
    };
  }, [autoStart]);

  return {
    startInterview: emitStartInterview,
    submitAnswer: emitSubmitAnswer,
    cleanupListeners: cleanupInterviewSocketListeners,
  };
}

export default useInterviewSocket;
