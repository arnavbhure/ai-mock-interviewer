import { useCallback, useEffect, useRef } from "react";
import { useInterviewStore } from "@/store/interview.store";
import {
  getInterviewState,
  submitResponse,
  endInterview as endInterviewService,
} from "@/services/interviewService";
import { MOCK_QUESTIONS } from "@/data/interview.mock";

/**
 * Manages the live interview state machine cycle:
 *
 *   AI_SPEAKING  →(auto ~3.5s)→  LISTENING
 *   LISTENING    →(user tap / auto ~8s)→  PROCESSING
 *   PROCESSING   →(auto ~1s)→  THINKING
 *   THINKING     →(auto ~1.5s)→  AI_SPEAKING (next question)
 *
 * User interaction (toggleListening) advances from LISTENING→PROCESSING.
 * Auto-timers provide fallback so the demo can run hands-free.
 */
export function useInterviewSession() {
  const store = useInterviewStore();
  const questionIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  // ── Load first question when phase becomes LIVE ──────────

  useEffect(() => {
    if (store.phase !== "LIVE") return;

    async function loadFirst() {
      questionIndexRef.current = 0;
      const { question } = await getInterviewState(0);
      if (question) {
        useInterviewStore.setState({
          currentQuestion: question,
          orbState: "AI_SPEAKING",
        });
      }
    }

    loadFirst();
  }, [store.phase]);

  // ── State machine auto-transitions ───────────────────────

  useEffect(() => {
    if (store.phase !== "LIVE") return;

    clearTimer();

    switch (store.orbState) {
      case "AI_SPEAKING":
        // After 3.5s of "speaking", transition to listening
        timerRef.current = setTimeout(() => {
          useInterviewStore.setState({ orbState: "LISTENING" });
        }, 3500);
        break;

      case "LISTENING":
        // Auto-fallback: if user doesn't tap mic, auto-advance after 8s
        timerRef.current = setTimeout(() => {
          useInterviewStore.setState({ orbState: "PROCESSING" });
        }, 8000);
        break;

      case "PROCESSING":
        // Short processing delay, then thinking
        timerRef.current = setTimeout(() => {
          useInterviewStore.setState({ orbState: "THINKING" });
        }, 1000);
        break;

      case "THINKING":
        // Think, then advance to next question or end
        timerRef.current = setTimeout(async () => {
          const nextIndex = questionIndexRef.current + 1;
          if (nextIndex >= MOCK_QUESTIONS.length) {
            useInterviewStore.getState().endInterview();
            return;
          }
          questionIndexRef.current = nextIndex;
          const { question } = await getInterviewState(nextIndex);
          if (question) {
            useInterviewStore.setState({
              currentQuestion: question,
              orbState: "AI_SPEAKING",
            });
          }
        }, 1500);
        break;
    }

    return clearTimer;
  }, [store.orbState, store.phase, clearTimer]);

  // ── User actions ─────────────────────────────────────────

  const toggleListening = useCallback(() => {
    const { orbState, interviewId, currentQuestion } =
      useInterviewStore.getState();

    if (orbState === "LISTENING") {
      // User signals they're done speaking → process
      clearTimer();
      useInterviewStore.setState({ orbState: "PROCESSING" });

      // Simulate submitting their response
      if (interviewId && currentQuestion) {
        submitResponse(
          interviewId,
          currentQuestion.id,
          "[mock transcript]",
        );
      }
    }
  }, [clearTimer]);

  const skipQuestion = useCallback(async () => {
    clearTimer();
    const nextIndex = questionIndexRef.current + 1;
    if (nextIndex >= MOCK_QUESTIONS.length) {
      useInterviewStore.getState().endInterview();
      return;
    }
    questionIndexRef.current = nextIndex;
    const { question } = await getInterviewState(nextIndex);
    if (question) {
      useInterviewStore.setState({
        currentQuestion: question,
        orbState: "AI_SPEAKING",
      });
    }
  }, [clearTimer]);

  const handleEndInterview = useCallback(async () => {
    clearTimer();
    const { interviewId } = useInterviewStore.getState();
    if (interviewId) {
      await endInterviewService(interviewId);
    }
    useInterviewStore.getState().endInterview();
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer]);

  return {
    orbState: store.orbState,
    currentQuestion: store.currentQuestion,
    interviewType: store.interviewType,
    toggleListening,
    skipQuestion,
    endInterview: handleEndInterview,
  };
}
