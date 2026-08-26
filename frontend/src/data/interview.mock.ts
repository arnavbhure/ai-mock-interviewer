import type { InterviewQuestion } from "@/types/interview.types";

/**
 * Realistic mock questions for the frontend demo.
 * Replace with real AI-generated questions from the backend.
 */
export const MOCK_QUESTIONS: Omit<InterviewQuestion, "questionNumber" | "totalQuestions">[] = [
  {
    id: "q_001",
    text: "Tell me about a challenging technical problem you solved recently. Walk me through your approach and the outcome.",
  },
  {
    id: "q_002",
    text: "How would you design a system that needs to handle millions of concurrent users with low latency requirements?",
  },
  {
    id: "q_003",
    text: "Describe a time when you had to make a significant trade-off in a project. What factors did you consider?",
  },
  {
    id: "q_004",
    text: "What's your approach to debugging a complex production issue that only appears intermittently?",
  },
  {
    id: "q_005",
    text: "How do you ensure code quality and maintainability in a fast-moving team? Give me a concrete example.",
  },
];

export const MOCK_INTERVIEW_CONFIG = {
  type: "Technical Interview",
  role: "Full Stack Developer",
  difficulty: "Medium",
  totalQuestions: MOCK_QUESTIONS.length,
} as const;

/**
 * Build a full InterviewQuestion from a mock entry and its index.
 */
export function buildMockQuestion(index: number): InterviewQuestion | null {
  const entry = MOCK_QUESTIONS[index];
  if (!entry) return null;

  return {
    ...entry,
    questionNumber: index + 1,
    totalQuestions: MOCK_QUESTIONS.length,
  };
}
