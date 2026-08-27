import { create } from "zustand";
import type {
  InterviewState,
  QuestionPayload,
  FinalEvaluation,
} from "@/types/interview.types";

const INITIAL_STATE = {
  interviewId: null,
  status: "idle" as const,
  currentRoundNumber: null,
  currentQuestionNumber: null,
  currentDifficulty: null,
  currentQuestion: null,
  answer: "",
  finalEvaluation: null,
  error: null,
};

export const useInterviewStore = create<InterviewState>((set) => ({
  ...INITIAL_STATE,

  startInterview: () =>
    set({
      status: "starting",
      error: null,
    }),

  setQuestion: (data: QuestionPayload) =>
    set({
      status: "active",
      currentRoundNumber: data.roundNumber ?? null,
      currentQuestionNumber: data.questionNumber ?? null,
      currentDifficulty: data.difficulty ?? null,
      currentQuestion:
        typeof data.question === "string"
          ? { text: data.question }
          : data.question,
      answer: "",
      error: null,
    }),

  setAnswer: (answer: string) => set({ answer }),

  setSubmitting: () => set({ status: "submitting" }),

  setCompleted: (interviewId: string, evaluation: FinalEvaluation) =>
    set({
      status: "completed",
      interviewId,
      finalEvaluation: evaluation,
      error: null,
    }),

  setError: (code: string, message: string) =>
    set({
      status: "error",
      error: { code, message },
    }),

  reset: () => set({ ...INITIAL_STATE }),
}));
