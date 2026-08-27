import { useCallback, useEffect, useRef, useState } from "react";
import { useInterviewStore } from "@/store/interview.store";
import type { OrbState } from "@/types/interview.types";
import {
  getInterviewState,
  submitResponse,
  endInterview as endInterviewService,
} from "@/services/interviewService";
import { MOCK_QUESTIONS, MOCK_INTERVIEW_CONFIG } from "@/data/interview.mock";

/**
 * Manages the live interview state machine cycle:
 *
 *   AI_SPEAKING  → (auto ~3.5s) →  LISTENING
 *   LISTENING    → (user tap / auto ~8s) →  PROCESSING
 *   PROCESSING   → (auto ~1s) →  THINKING
 *   THINKING     → (auto ~1.5s) →  AI_SPEAKING (next question)
 */
export function useInterviewSession() {
  const status = useInterviewStore((s) => s.status);
  const interviewId = useInterviewStore((s) => s.interviewId);
  const currentQuestion = useInterviewStore((s) => s.currentQuestion);
  const setQuestion = useInterviewStore((s) => s.setQuestion);
  const submitAnswer = useInterviewStore((s) => s.submitAnswer);
  const setCompleted = useInterviewStore((s) => s.setCompleted);

  const [orbState, setOrbState] = useState<OrbState>("AI_SPEAKING");

  const questionIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  // ─── Load first question when session starts ───────────────────

  useEffect(() => {
    if (status !== "active" && status !== "starting") return;

    async function loadFirst() {
      questionIndexRef.current = 0;
      const { question } = await getInterviewState(0);
      if (question) {
        setQuestion({
          questionNumber: question.questionNumber,
          question,
        });
        setOrbState("AI_SPEAKING");
      }
    }

    if (!currentQuestion) {
      loadFirst();
    }
  }, [status, currentQuestion, setQuestion]);

  // ─── State machine auto-transitions ────────────────────────────

  useEffect(() => {
    if (status !== "active") return;

    clearTimer();

    switch (orbState) {
      case "AI_SPEAKING":
        // After 3.5s of "speaking", transition to listening
        timerRef.current = setTimeout(() => {
          setOrbState("LISTENING");
        }, 3500);
        break;

      case "LISTENING":
        // Auto-fallback: if user doesn't tap mic, auto-advance after 8s
        timerRef.current = setTimeout(() => {
          setOrbState("PROCESSING");
        }, 8000);
        break;

      case "PROCESSING":
        // Short processing delay, then thinking
        timerRef.current = setTimeout(() => {
          setOrbState("THINKING");
        }, 1000);
        break;

      case "THINKING":
        // Think, then advance to next question or end
        timerRef.current = setTimeout(async () => {
          const nextIndex = questionIndexRef.current + 1;
          if (nextIndex >= MOCK_QUESTIONS.length) {
            setCompleted({
              overallScore: 85,
              summary: "Interview completed successfully.",
            });
            return;
          }
          questionIndexRef.current = nextIndex;
          const { question } = await getInterviewState(nextIndex);
          if (question) {
            setQuestion({
              questionNumber: question.questionNumber,
              question,
            });
            setOrbState("AI_SPEAKING");
          }
        }, 1500);
        break;
    }

    return clearTimer;
  }, [orbState, status, clearTimer, setQuestion, setCompleted]);

  // ─── User actions ──────────────────────────────────────────────

  const toggleListening = useCallback(() => {
    if (orbState === "LISTENING") {
      clearTimer();
      setOrbState("PROCESSING");
      submitAnswer();

      if (interviewId && currentQuestion) {
        submitResponse(
          interviewId,
          currentQuestion.id ?? `q_${questionIndexRef.current}`,
          "[mock transcript]",
        );
      }
    }
  }, [orbState, clearTimer, submitAnswer, interviewId, currentQuestion]);

  const skipQuestion = useCallback(async () => {
    clearTimer();
    const nextIndex = questionIndexRef.current + 1;
    if (nextIndex >= MOCK_QUESTIONS.length) {
      setCompleted({
        overallScore: 85,
        summary: "Interview completed successfully.",
      });
      return;
    }
    questionIndexRef.current = nextIndex;
    const { question } = await getInterviewState(nextIndex);
    if (question) {
      setQuestion({
        questionNumber: question.questionNumber,
        question,
      });
      setOrbState("AI_SPEAKING");
    }
  }, [clearTimer, setCompleted, setQuestion]);

  const handleEndInterview = useCallback(async () => {
    clearTimer();
    if (interviewId) {
      await endInterviewService(interviewId);
    }
    setCompleted({
      overallScore: 80,
      summary: "Interview ended by candidate.",
    });
  }, [clearTimer, interviewId, setCompleted]);

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer]);

  return {
    orbState,
    currentQuestion,
    interviewType: MOCK_INTERVIEW_CONFIG.type,
    toggleListening,
    skipQuestion,
    endInterview: handleEndInterview,
  };
}
