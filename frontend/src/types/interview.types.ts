/* ==========================================================
   INTERVIEW SESSION — TYPE DEFINITIONS (V1 Real-Time)
   ========================================================== */

// ─── Real-Time Interview Session Types ───────────────────────

export type InterviewStatus =
  | "idle"
  | "starting"
  | "active"
  | "submitting"
  | "completed"
  | "error";

export type InterviewDifficulty = "easy" | "medium" | "hard";

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

export interface SetQuestionPayload {
  roundNumber?: number | null;
  questionNumber?: number | null;
  difficulty?: InterviewDifficulty | null;
  question: InterviewQuestion | string;
}

export interface InterviewState {
  interviewId: string | null;
  status: InterviewStatus;
  currentRoundNumber: number | null;
  currentQuestionNumber: number | null;
  currentDifficulty: InterviewDifficulty | null;
  currentQuestion: InterviewQuestion | null;
  answer: string;
  finalEvaluation: FinalEvaluation | null;
  error: string | null;
}

export interface InterviewActions {
  startInterview: (interviewId?: string) => void;
  setQuestion: (data: SetQuestionPayload) => void;
  setAnswer: (answer: string) => void;
  submitAnswer: () => void;
  setCompleted: (finalEvaluation: FinalEvaluation) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export type InterviewStore = InterviewState & InterviewActions;

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
