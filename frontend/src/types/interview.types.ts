/* ==========================================================
   INTERVIEW FLOW — TYPE DEFINITIONS
   ========================================================== */

// ── Preparation ──────────────────────────────────────────────

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

/** Human-readable labels for each preparation step. */
export const PREPARATION_STEP_LABELS: Record<PreparationStep, string> = {
  ANALYZING_RESUME: "Analyzing your resume",
  UNDERSTANDING_EXPERIENCE: "Understanding your experience",
  BUILDING_PLAN: "Building your interview plan",
  PREPARING_QUESTIONS: "Preparing personalized questions",
  PREPARING_INTERVIEWER: "Preparing your interviewer",
  COMPLETE: "Interview ready",
};

// ── Interview Phases ─────────────────────────────────────────

export type InterviewPhase =
  | "PREPARATION"
  | "READY_TRANSITION"
  | "LIVE"
  | "COMPLETED";

// ── Orb / AI Visual State ────────────────────────────────────

export type OrbState = "AI_SPEAKING" | "LISTENING" | "THINKING" | "PROCESSING";

// ── Questions ────────────────────────────────────────────────

export interface InterviewQuestion {
  id: string;
  text: string;
  questionNumber: number;
  totalQuestions: number;
}

// ── Session State (Zustand shape) ────────────────────────────

export interface InterviewSessionState {
  /** Current high-level phase of the interview flow. */
  phase: InterviewPhase;

  /** Preparation sub-state. */
  preparationStatus: PreparationStatus;
  currentStep: PreparationStep;
  completedSteps: PreparationStep[];
  preparationError: string | null;

  /** Live interview sub-state. */
  orbState: OrbState;
  currentQuestion: InterviewQuestion | null;
  interviewId: string | null;
  interviewType: string;

  /** Actions */
  startPreparation: () => void;
  advanceStep: (step: PreparationStep) => void;
  completePreparation: () => void;
  setPhase: (phase: InterviewPhase) => void;
  setOrbState: (state: OrbState) => void;
  setQuestion: (question: InterviewQuestion) => void;
  setPreparationError: (error: string) => void;
  endInterview: () => void;
  reset: () => void;
}
