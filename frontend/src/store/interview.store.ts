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
  interviewId: null as string | null,
  status: "idle" as const,

  roundNumber: null as number | null,
  questionNumber: null as number | null,
  roundType: "Technical Interview",
  difficulty: null as InterviewState["difficulty"],

  role: null as string | null,
  resumeFileName: null as string | null,
  resumeId: null as string | null,

  currentQuestion: null as InterviewQuestion | null,

  aiState: "idle" as AIInterviewState,
  currentAIMessage: "",

  candidateAnswer: "",

  preparationState: INITIAL_PREPARATION_STATE,

  evaluation: null as FinalEvaluation | null,
  completionData: null as FinalEvaluation | null,

  errorCode: null as string | null,
  errorMessage: null as string | null,

  codingState: INITIAL_CODING_STATE,

  // Aliases for compatibility
  answer: "",
  finalEvaluation: null as FinalEvaluation | null,
  currentRoundNumber: null as number | null,
  currentQuestionNumber: null as number | null,
  currentDifficulty: null as InterviewState["difficulty"],
  error: null as InterviewState["error"],
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

  setInterviewConfig: (config: {
    role?: string | null;
    difficulty?: InterviewState["difficulty"];
    resumeFileName?: string | null;
    resumeId?: string | null;
  }) =>
    set((state) => ({
      ...state,
      role: config.role !== undefined ? config.role : state.role,
      difficulty: config.difficulty !== undefined ? config.difficulty : state.difficulty,
      currentDifficulty: config.difficulty !== undefined ? config.difficulty : state.difficulty,
      resumeFileName: config.resumeFileName !== undefined ? config.resumeFileName : state.resumeFileName,
      resumeId: config.resumeId !== undefined ? config.resumeId : state.resumeId,
    })),

  setStatus: (status: InterviewState["status"]) =>
    set({
      status,
      ...(status === "error" ? {} : { errorCode: null, errorMessage: null, error: null }),
    }),

  setConnecting: () =>
    set({
      status: "connecting",
      aiState: "thinking",
      errorCode: null,
      errorMessage: null,
      error: null,
    }),

  setStarting: () =>
    set({
      status: "starting",
      aiState: "thinking",
      errorCode: null,
      errorMessage: null,
      error: null,
    }),

  setWaiting: () =>
    set({
      status: "waiting",
      aiState: "thinking",
      errorCode: null,
      errorMessage: null,
      error: null,
    }),

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
      let questionText = "";
      let topic: string | undefined;
      let roundNum = state.roundNumber;
      let questionNum = state.questionNumber;
      let diff = state.difficulty;

      if (typeof data === "string") {
        questionText = data;
      } else if (data && typeof data === "object") {
        const raw = data as Record<string, unknown>;

        if ("question" in raw && raw.question !== undefined && raw.question !== null) {
          const qVal = raw.question;
          if (typeof qVal === "string") {
            questionText = qVal;
          } else if (typeof qVal === "object" && qVal !== null) {
            const qObj = qVal as Record<string, unknown>;
            questionText =
              (typeof qObj.question === "string" && qObj.question) ||
              (typeof qObj.text === "string" && qObj.text) ||
              (typeof qObj.prompt === "string" && qObj.prompt) ||
              "";
            const focusArea = typeof qObj.focusArea === "string" ? qObj.focusArea : null;
            const questionType = typeof qObj.questionType === "string" ? qObj.questionType : undefined;
            topic =
              focusArea ||
              (typeof qObj.topic === "string" && qObj.topic) ||
              questionType ||
              undefined;
          }
          roundNum = (typeof raw.roundNumber === "number" ? raw.roundNumber : null) ?? roundNum;
          questionNum = (typeof raw.questionNumber === "number" ? raw.questionNumber : null) ?? questionNum;
          diff = (raw.difficulty as InterviewState["difficulty"]) ?? diff;
        } else if ("text" in raw && typeof raw.text === "string") {
          questionText = raw.text;
          topic =
            (typeof raw.topic === "string" && raw.topic) ||
            (typeof raw.focusArea === "string" && raw.focusArea) ||
            undefined;
          questionNum = typeof raw.questionNumber === "number" ? raw.questionNumber : questionNum;
        }
      }

      const questionObj: InterviewQuestion = {
        text: questionText,
        topic,
        questionNumber: questionNum ?? undefined,
      };

      return {
        status: "active",
        roundNumber: roundNum,
        questionNumber: questionNum,
        difficulty: diff,
        currentQuestion: questionObj,
        candidateAnswer: "",
        answer: "",
        aiState: "speaking",
        currentAIMessage: questionText,
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

  setCandidateAnswer: (candidateAnswer: string | ((prev: string) => string)) =>
    set((state) => {
      const prevVal =
        typeof state.candidateAnswer === "string"
          ? state.candidateAnswer
          : typeof state.answer === "string"
            ? state.answer
            : "";
      const resolved =
        typeof candidateAnswer === "function"
          ? candidateAnswer(prevVal)
          : candidateAnswer;
      const finalStr = typeof resolved === "string" ? resolved : String(resolved || "");
      return {
        candidateAnswer: finalStr,
        answer: finalStr,
      };
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
    set((state) => {
      const evalData = data ?? state.evaluation ?? state.completionData;
      return {
        status: "completed",
        interviewId: interviewId ?? state.interviewId,
        evaluation: evalData,
        completionData: evalData,
        finalEvaluation: evalData,
        aiState: "idle",
        errorCode: null,
        errorMessage: null,
        error: null,
      };
    }),

  setError: (errorOrCode: string | { code: string; message: string }, messageIfSecond?: string) =>
    set(() => {
      const code = typeof errorOrCode === "object" ? errorOrCode.code : errorOrCode;
      const message =
        typeof errorOrCode === "object"
          ? errorOrCode.message
          : (messageIfSecond ?? "");

      return {
        status: "error",
        errorCode: code,
        errorMessage: message,
        error: { code, message },
        aiState: "idle",
      };
    }),

  resetInterview: () => set({ ...INITIAL_STATE }),

  // ─── Compatibility Action Aliases ───────────────────────────
  setAnswer: (answer: string | ((prev: string) => string)) =>
    set((state) => {
      const prevVal =
        typeof state.answer === "string"
          ? state.answer
          : typeof state.candidateAnswer === "string"
            ? state.candidateAnswer
            : "";
      const resolved =
        typeof answer === "function"
          ? answer(prevVal)
          : answer;
      const finalStr = typeof resolved === "string" ? resolved : String(resolved || "");
      return {
        candidateAnswer: finalStr,
        answer: finalStr,
      };
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
    interviewIdOrPayload: string | { interviewId?: string; evaluation?: FinalEvaluation } | FinalEvaluation,
    evalIfSecond?: FinalEvaluation,
  ) =>
    set((state) => {
      let id: string | null = state.interviewId;
      let evalData: FinalEvaluation | null = null;

      if (typeof interviewIdOrPayload === "string") {
        id = interviewIdOrPayload;
        evalData = evalIfSecond ?? null;
      } else if (
        typeof interviewIdOrPayload === "object" &&
        interviewIdOrPayload !== null
      ) {
        const payloadObj = interviewIdOrPayload as Record<string, unknown>;
        if (typeof payloadObj.interviewId === "string") {
          id = payloadObj.interviewId;
        }
        if (payloadObj.evaluation && typeof payloadObj.evaluation === "object") {
          evalData = payloadObj.evaluation as FinalEvaluation;
        } else {
          evalData = interviewIdOrPayload as FinalEvaluation;
        }
      }

      return {
        status: "completed",
        interviewId: id,
        evaluation: evalData,
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

