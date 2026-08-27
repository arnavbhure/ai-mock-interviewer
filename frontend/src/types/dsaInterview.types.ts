/* ==========================================================
   DSA CODING INTERVIEW - TYPE DEFINITIONS (Refined Flow)
   ========================================================== */

export type DSALanguage = "javascript" | "python" | "cpp" | "java";

export type DSAInterviewStage =
  | "INTRO"
  | "APPROACH_DISCUSSION"
  | "APPROACH_EVALUATION"
  | "CODING"
  | "RUNNING_CODE"
  | "TEST_RESULTS"
  | "SUBMITTING"
  | "POST_SUBMISSION_DISCUSSION"
  | "COMPLETED";

export type AIOrbVisualState = "speaking" | "listening" | "thinking" | "idle";

export interface DSATestCase {
  id: number;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  executionTime?: string;
  memory?: string;
  stdout?: string;
}

export interface DSAProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface DSAProblem {
  id: string;
  title: string;
  roundTitle: string;
  questionNumber: number;
  totalQuestions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
  examples: DSAProblemExample[];
  constraints: string[];
  hints: string[];
  starterCode: Record<DSALanguage, string>;
  solutionCode?: Record<DSALanguage, string>;
  testCases: DSATestCase[];
}

export interface DSASubmissionSummary {
  status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error";
  totalTests: number;
  passedTests: number;
  runtime: string;
  memory: string;
  complexityTime: string;
  complexitySpace: string;
  feedback: string;
}

export interface DSADialogueStep {
  aiText: string;
  stateLabel: string;
  orbState: AIOrbVisualState;
  candidatePromptPlaceholder?: string;
  suggestedAnswers?: string[];
  requiresCandidateResponse?: boolean;
}
