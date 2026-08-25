import { create } from "zustand";
import type {
  InterviewPhase,
  InterviewSessionState,
  OrbState,
  PreparationStep,
  InterviewQuestion,
} from "@/types/interview.types";

const INITIAL_STATE = {
  phase: "PREPARATION" as InterviewPhase,
  preparationStatus: "PREPARING" as const,
  currentStep: "ANALYZING_RESUME" as PreparationStep,
  completedSteps: [] as PreparationStep[],
  preparationError: null as string | null,
  orbState: "AI_SPEAKING" as OrbState,
  currentQuestion: null as InterviewQuestion | null,
  interviewId: null as string | null,
  interviewType: "Technical Interview",
};

export const useInterviewStore = create<InterviewSessionState>((set) => ({
  ...INITIAL_STATE,

  startPreparation: () =>
    set({
      phase: "PREPARATION",
      preparationStatus: "PREPARING",
      currentStep: "ANALYZING_RESUME",
      completedSteps: [],
      preparationError: null,
    }),

  advanceStep: (step: PreparationStep) =>
    set((state) => ({
      currentStep: step,
      completedSteps: state.completedSteps.includes(state.currentStep)
        ? state.completedSteps
        : [...state.completedSteps, state.currentStep],
    })),

  completePreparation: () =>
    set((state) => ({
      preparationStatus: "READY",
      currentStep: "COMPLETE",
      completedSteps: [...state.completedSteps, "PREPARING_INTERVIEWER"],
    })),

  setPhase: (phase: InterviewPhase) => set({ phase }),

  setOrbState: (orbState: OrbState) => set({ orbState }),

  setQuestion: (currentQuestion: InterviewQuestion) =>
    set({ currentQuestion }),

  setPreparationError: (error: string) =>
    set({ preparationStatus: "ERROR", preparationError: error }),

  endInterview: () => set({ phase: "COMPLETED" }),

  reset: () => set({ ...INITIAL_STATE }),
}));
