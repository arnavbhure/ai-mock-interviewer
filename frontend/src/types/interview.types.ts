/* ==========================================================
   INTERVIEW SESSION — TYPE DEFINITIONS (V1 Real-Time & Store)
   ========================================================== */

import type { DSALanguage, DSATestCase, DSASubmissionSummary } from "./dsaInterview.types";

// ─── Core Interview Status & Difficulty ───────────────────────

export type InterviewStatus =
  | "idle"
  | "preparing"
  | "starting"
  | "active"
  | "submitting"
  | "completed"
  | "error";

export type InterviewDifficulty = "easy" | "medium" | "hard";

export type AIInterviewState = "speaking" | "listening" | "thinking" | "idle";

// ─── Question & Evaluation Models ─────────────────────────────

export interface InterviewQuestion {
  id?: string;
  text: string;
  questionNumber?: number;
  totalQuestions?: number;
  topic?: string;
}

export interface FinalEvaluation {
  overallScore?: number;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  summary?: string;
  [key: string]: unknown;
}

export interface InterviewError {
  code: string;
  message: string;
}

export interface PreparationState {
  isPreparing: boolean;
  currentStep: string;
  completedSteps: string[];
  error: string | null;
}

export interface CodingState {
  language: DSALanguage;
  code: string;
  testCases: DSATestCase[];
  testResults: DSATestCase[];
  executionStatus: "idle" | "running" | "completed";
  submissionStatus: "idle" | "evaluating" | "accepted" | "rejected";
  submissionSummary: DSASubmissionSummary | null;
}

// ─── Socket.IO Payloads (Fixed Backend Contract) ─────────────

/** Backend -> Frontend: "interview:question" payload */
export interface QuestionPayload {
  roundNumber?: number | null;
  questionNumber?: number | null;
  difficulty?: InterviewDifficulty | null;
  question: InterviewQuestion | string;
}

export type SetQuestionPayload = QuestionPayload;

/** Backend -> Frontend: "interview:completed" payload */
export interface CompletedPayload {
  interviewId: string;
  evaluation: FinalEvaluation;
}

/** Backend -> Frontend: "interview:error" payload */
export interface ErrorPayload {
  code: string;
  message: string;
}

/** Frontend -> Backend: "interview:answer" payload */
export interface AnswerPayload {
  answer: string;
}

// ─── Zustand Store State & Actions ───────────────────────────

export interface InterviewState {
  interviewId: string | null;
  status: InterviewStatus;

  roundNumber: number | null;
  questionNumber: number | null;
  roundType: string | null;
  difficulty: InterviewDifficulty | null;

  currentQuestion: InterviewQuestion | null;

  aiState: AIInterviewState;
  currentAIMessage: string;

  candidateAnswer: string;

  preparationState: PreparationState;

  completionData: FinalEvaluation | null;

  errorCode: string | null;
  errorMessage: string | null;

  codingState: CodingState;

  // Aliases for compatibility with existing components
  answer: string;
  finalEvaluation: FinalEvaluation | null;
  currentRoundNumber: number | null;
  currentQuestionNumber: number | null;
  currentDifficulty: InterviewDifficulty | null;
  error: InterviewError | null;

  // Actions
  initializeInterview: (config?: Partial<InterviewState>) => void;
  startPreparing: () => void;
  startInterview: () => void;
  setQuestion: (data: QuestionPayload | InterviewQuestion | string) => void;
  setAIState: (aiState: AIInterviewState | OrbState) => void;
  setAIMessage: (message: string) => void;
  setCandidateAnswer: (answer: string) => void;
  setCodingState: (codingState: Partial<CodingState>) => void;
  setCode: (code: string) => void;
  setLanguage: (language: DSALanguage) => void;
  setTestResults: (results: DSATestCase[]) => void;
  setExecutionStatus: (status: "idle" | "running" | "completed") => void;
  setSubmissionStatus: (
    status: "idle" | "evaluating" | "accepted" | "rejected",
    summary?: DSASubmissionSummary | null,
  ) => void;
  completeInterview: (data?: FinalEvaluation | null, interviewId?: string) => void;
  setError: (code: string, message: string) => void;
  resetInterview: () => void;

  // Compatibility action aliases
  setAnswer: (answer: string) => void;
  setSubmitting: () => void;
  submitAnswer: () => void;
  setCompleted: (interviewIdOrEval: string | FinalEvaluation, evalIfSecond?: FinalEvaluation) => void;
  reset: () => void;
}

export type InterviewStore = InterviewState;

// ─── UI & Visual Animation Types ─────────────────────────────

export type OrbState =
  | "AI_SPEAKING"
  | "LISTENING"
  | "THINKING"
  | "PROCESSING"
  | "speaking"
  | "listening"
  | "thinking"
  | "processing"
  | "idle";

export const PREPARATION_STEPS = [
  "ANALYZING_RESUME",
  "UNDERSTANDING_EXPERIENCE",
  "BUILDING_PLAN",
  "PREPARING_QUESTIONS",
  "PREPARING_INTERVIEWER",
  "COMPLETE",
] as const;

export type PreparationStep = (typeof PREPARATION_STEPS)[number];

export type PreparationStatus = "PREPARING" | "READY" | "ERROR";

export const PREPARATION_STEP_LABELS: Record<PreparationStep, string> = {
  ANALYZING_RESUME: "Analyzing your resume",
  UNDERSTANDING_EXPERIENCE: "Understanding your experience",
  BUILDING_PLAN: "Building your interview plan",
  PREPARING_QUESTIONS: "Preparing personalized questions",
  PREPARING_INTERVIEWER: "Preparing your interviewer",
  COMPLETE: "Interview ready",
};

export type InterviewPhase =
  | "PREPARATION"
  | "READY_TRANSITION"
  | "LIVE"
  | "COMPLETED";
