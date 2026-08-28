import { create } from "zustand";
import type {
  InterviewState,
  InterviewQuestion,
  QuestionPayload,
  FinalEvaluation,
  CodingState,
  PreparationState,
  AIInterviewState,
  OrbState,
} from "@/types/interview.types";
import type { DSALanguage, DSATestCase, DSASubmissionSummary } from "@/types/dsaInterview.types";

const INITIAL_PREPARATION_STATE: PreparationState = {
  isPreparing: false,
  currentStep: "ANALYZING_RESUME",
  completedSteps: [],
  error: null,
};

const INITIAL_CODING_STATE: CodingState = {
  language: "javascript",
  code: "",
  testCases: [],
  testResults: [],
  executionStatus: "idle",
  submissionStatus: "idle",
  submissionSummary: null,
};

const INITIAL_STATE = {
  interviewId: null,
  status: "idle" as const,

  roundNumber: null,
  questionNumber: null,
  roundType: "Technical Interview",
  difficulty: null,

  currentQuestion: null,

  aiState: "idle" as AIInterviewState,
  currentAIMessage: "",

  candidateAnswer: "",

  preparationState: INITIAL_PREPARATION_STATE,

  completionData: null,

  errorCode: null,
  errorMessage: null,

  codingState: INITIAL_CODING_STATE,

  // Aliases for compatibility
  answer: "",
  finalEvaluation: null,
  currentRoundNumber: null,
  currentQuestionNumber: null,
  currentDifficulty: null,
  error: null,
};

function normalizeAIState(state: AIInterviewState | OrbState): AIInterviewState {
  const s = state.toLowerCase();
  if (s.includes("speak")) return "speaking";
  if (s.includes("listen")) return "listening";
  if (s.includes("think") || s.includes("process")) return "thinking";
  return "idle";
}

export const useInterviewStore = create<InterviewState>((set) => ({
  ...INITIAL_STATE,

  initializeInterview: (config?: Partial<InterviewState>) =>
    set((state) => ({
      ...state,
      ...config,
      status: config?.status ?? "idle",
      errorCode: null,
      errorMessage: null,
      error: null,
    })),

  startPreparing: () =>
    set((state) => ({
      status: "preparing",
      preparationState: {
        ...state.preparationState,
        isPreparing: true,
        error: null,
      },
      errorCode: null,
      errorMessage: null,
      error: null,
    })),

  startInterview: () =>
    set({
      status: "starting",
      aiState: "thinking",
      errorCode: null,
      errorMessage: null,
      error: null,
    }),

  setQuestion: (data: QuestionPayload | InterviewQuestion | string) =>
    set((state) => {
      let questionObj: InterviewQuestion;
      let roundNum = state.roundNumber;
      let questionNum = state.questionNumber;
      let diff = state.difficulty;

      if (typeof data === "string") {
        questionObj = { text: data };
      } else if ("question" in data && data.question) {
        questionObj =
          typeof data.question === "string"
            ? { text: data.question }
            : data.question;
        roundNum = data.roundNumber ?? roundNum;
        questionNum = data.questionNumber ?? questionNum;
        diff = data.difficulty ?? diff;
      } else {
        questionObj = data as InterviewQuestion;
        questionNum = questionObj.questionNumber ?? questionNum;
      }

      return {
        status: "active",
        roundNumber: roundNum,
        questionNumber: questionNum,
        difficulty: diff,
        currentQuestion: questionObj,
        candidateAnswer: "",
        answer: "",
        aiState: "speaking",
        currentAIMessage: questionObj.text,
        errorCode: null,
        errorMessage: null,
        error: null,
        // Aliases
        currentRoundNumber: roundNum,
        currentQuestionNumber: questionNum,
        currentDifficulty: diff,
      };
    }),

  setAIState: (aiState: AIInterviewState | OrbState) =>
    set({
      aiState: normalizeAIState(aiState),
    }),

  setAIMessage: (currentAIMessage: string) =>
    set({
      currentAIMessage,
    }),

  setCandidateAnswer: (candidateAnswer: string) =>
    set({
      candidateAnswer,
      answer: candidateAnswer,
    }),

  setCodingState: (partialCodingState: Partial<CodingState>) =>
    set((state) => ({
      codingState: {
        ...state.codingState,
        ...partialCodingState,
      },
    })),

  setCode: (code: string) =>
    set((state) => ({
      codingState: {
        ...state.codingState,
        code,
      },
    })),

  setLanguage: (language: DSALanguage) =>
    set((state) => ({
      codingState: {
        ...state.codingState,
        language,
      },
    })),

  setTestResults: (testResults: DSATestCase[]) =>
    set((state) => ({
      codingState: {
        ...state.codingState,
        testResults,
        executionStatus: "completed",
      },
    })),

  setExecutionStatus: (executionStatus: "idle" | "running" | "completed") =>
    set((state) => ({
      codingState: {
        ...state.codingState,
        executionStatus,
      },
    })),

  setSubmissionStatus: (
    submissionStatus: "idle" | "evaluating" | "accepted" | "rejected",
    submissionSummary?: DSASubmissionSummary | null,
  ) =>
    set((state) => ({
      codingState: {
        ...state.codingState,
        submissionStatus,
        submissionSummary:
          submissionSummary !== undefined
            ? submissionSummary
            : state.codingState.submissionSummary,
      },
    })),

  completeInterview: (data?: FinalEvaluation | null, interviewId?: string) =>
    set((state) => ({
      status: "completed",
      interviewId: interviewId ?? state.interviewId,
      completionData: data ?? state.completionData,
      finalEvaluation: data ?? state.completionData,
      aiState: "idle",
      errorCode: null,
      errorMessage: null,
      error: null,
    })),

  setError: (code: string, message: string) =>
    set({
      status: "error",
      errorCode: code,
      errorMessage: message,
      error: { code, message },
    }),

  resetInterview: () => set({ ...INITIAL_STATE }),

  // ─── Compatibility Action Aliases ───────────────────────────
  setAnswer: (answer: string) =>
    set({
      candidateAnswer: answer,
      answer,
    }),

  setSubmitting: () =>
    set({
      status: "submitting",
      aiState: "thinking",
    }),

  submitAnswer: () =>
    set({
      status: "submitting",
      aiState: "thinking",
    }),

  setCompleted: (
    interviewIdOrEval: string | FinalEvaluation,
    evalIfSecond?: FinalEvaluation,
  ) =>
    set((state) => {
      const id =
        typeof interviewIdOrEval === "string"
          ? interviewIdOrEval
          : state.interviewId;
      const evalData =
        typeof interviewIdOrEval === "string"
          ? (evalIfSecond ?? null)
          : interviewIdOrEval;

      return {
        status: "completed",
        interviewId: id,
        completionData: evalData,
        finalEvaluation: evalData,
        aiState: "idle",
        errorCode: null,
        errorMessage: null,
        error: null,
      };
    }),

  reset: () => set({ ...INITIAL_STATE }),
}));
