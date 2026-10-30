export interface ReportInterview {
  id: string;
  role: string;
  difficulty: string;
  status: string;
  createdAt: string;
  completedAt?: string | null;
}

export interface ReportFinalEvaluation {
  overallScore: number;
  hireChance: "Strong Hire" | "Hire" | "Weak Hire" | "No Hire" | string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface ReportQuestionEvaluation {
  roundNumber?: number;
  questionNumber?: number;
  roundType?: string;
  question?: string | { text?: string; question?: string; topic?: string };
  answer?: string;
  score?: number;
  feedback?: string;
  strengths?: string[];
  weaknesses?: string[];
}

export interface ReportDSAEvaluation {
  id: string;
  problemId: number | string;
  problemTitle?: string;
  score: number;
  correctness: string;
  timeComplexity: string;
  spaceComplexity: string;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  createdAt?: string;
}

export interface AvailableInterviewOption {
  id: string;
  role: string;
  difficulty: string;
  createdAt: string;
  score?: number | null;
  hireChance?: string | null;
}

export interface ReportData {
  interview: ReportInterview | null;
  finalEvaluation: ReportFinalEvaluation | null;
  questionEvaluations: ReportQuestionEvaluation[];
  dsaEvaluations: ReportDSAEvaluation[];
  availableInterviews: AvailableInterviewOption[];
}

