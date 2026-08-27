/* ==========================================================
   INTERVIEW SESSION — TYPE DEFINITIONS (V1 Real-Time)
   ========================================================== */

// ─── Core Interview Status & Difficulty ───────────────────────

export type InterviewStatus =
  | "idle"
  | "starting"
  | "active"
  | "submitting"
  | "completed"
  | "error";

export type InterviewDifficulty = "easy" | "medium" | "hard";

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

// ─── Socket.IO Payloads (Fixed Backend Contract) ─────────────

/** Backend -> Frontend: "interview:question" payload */
export interface QuestionPayload {
  roundNumber: number;
  questionNumber: number;
  difficulty: InterviewDifficulty;
  question: InterviewQuestion;
}

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

  currentRoundNumber: number | null;
  currentQuestionNumber: number | null;
  currentDifficulty: InterviewDifficulty | null;

  currentQuestion: InterviewQuestion | null;

  answer: string;

  finalEvaluation: FinalEvaluation | null;

  error: InterviewError | null;

  // Actions
  startInterview: () => void;
  setQuestion: (data: QuestionPayload) => void;
  setAnswer: (answer: string) => void;
  setSubmitting: () => void;
  setCompleted: (interviewId: string, evaluation: FinalEvaluation) => void;
  setError: (code: string, message: string) => void;
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
