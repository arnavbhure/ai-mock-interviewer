import { create } from "zustand";
import type {
  InterviewState,
  InterviewStore,
  SetQuestionPayload,
  FinalEvaluation,
} from "@/types/interview.types";

const INITIAL_STATE: InterviewState = {
  interviewId: null,
  status: "idle",
  currentRoundNumber: null,
  currentQuestionNumber: null,
  currentDifficulty: null,
  currentQuestion: null,
  answer: "",
  finalEvaluation: null,
  error: null,
};

export const useInterviewStore = create<InterviewStore>((set) => ({
  ...INITIAL_STATE,

  startInterview: (interviewId?: string) =>
    set({
      status: "starting",
      interviewId: interviewId ?? null,
      error: null,
    }),

  setQuestion: (payload: SetQuestionPayload) =>
    set((state) => {
      const questionObj =
        typeof payload.question === "string"
          ? { text: payload.question }
          : payload.question;

      return {
        status: "active",
        currentRoundNumber:
          payload.roundNumber !== undefined
            ? payload.roundNumber
            : state.currentRoundNumber,
        currentQuestionNumber:
          payload.questionNumber !== undefined
            ? payload.questionNumber
            : (questionObj?.questionNumber ?? state.currentQuestionNumber),
        currentDifficulty:
          payload.difficulty !== undefined
            ? payload.difficulty
            : state.currentDifficulty,
        currentQuestion: questionObj,
        answer: "",
        error: null,
      };
    }),

  setAnswer: (answer: string) => set({ answer }),

  submitAnswer: () => set({ status: "submitting" }),

  setCompleted: (finalEvaluation: FinalEvaluation) =>
    set({
      status: "completed",
      finalEvaluation,
      error: null,
    }),

  setError: (error: string) =>
    set({
      status: "error",
      error,
    }),

  reset: () => set({ ...INITIAL_STATE }),
}));
