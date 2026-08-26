/* ==========================================================
   INTERVIEW SESSION — TYPE DEFINITIONS (V1 Real-Time)
   ========================================================== */

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
