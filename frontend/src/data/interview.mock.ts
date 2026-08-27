import type { InterviewQuestion } from "@/types/interview.types";

export interface MockQuestionData extends InterviewQuestion {
  id: string;
  text: string;
  topic: string;
  sampleAnswer: string;
  questionNumber: number;
  totalQuestions: number;
}

/**
 * Realistic mock questions for the frontend demo.
 * Structured so backend socket events can easily provide dynamic payloads later.
 */
export const MOCK_QUESTIONS: Omit<MockQuestionData, "questionNumber" | "totalQuestions">[] = [
  {
    id: "q_001",
    topic: "Introduction & Overview",
    text: "Tell me about yourself and your experience as a Full Stack Developer.",
    sampleAnswer:
      "I've been working as a full stack developer for the past 4 years, building high-scale React and Node.js applications with a focus on real-time data and microservice architectures.",
  },
  {
    id: "q_002",
    topic: "Technical Problem Solving",
    text: "Can you describe a challenging technical problem you solved recently? Walk me through your approach and the outcome.",
    sampleAnswer:
      "Recently, our WebSocket server was experiencing memory leaks during peak traffic. I profiled the V8 heap dumps, identified uncollected event listener closures, and implemented bounded connection pools.",
  },
  {
    id: "q_003",
    topic: "System Design & Scalability",
    text: "How would you design a scalable API and caching strategy for a high-traffic application handling millions of concurrent users?",
    sampleAnswer:
      "I would use a multi-tiered caching architecture with edge CDN caching for static payloads, Redis distributed cache for session and active entity data, and read-replica database pools with rate-limiting.",
  },
  {
    id: "q_004",
    topic: "Debugging & Reliability",
    text: "Tell me about a time you had to debug a difficult production issue that only appeared intermittently.",
    sampleAnswer:
      "We encountered an intermittent race condition in our payment checkout queue. I enabled distributed OpenTelemetry tracing, traced asynchronous lock contention, and migrated to idempotent database transactions.",
  },
  {
    id: "q_005",
    topic: "Engineering Practices & Quality",
    text: "How do you ensure code quality, automated testing, and maintainability in a fast-moving engineering team?",
    sampleAnswer:
      "I advocate for contract-driven API schemas, automated unit and integration CI pipelines, strict TypeScript linting, and thorough peer code reviews focused on architecture and edge cases.",
  },
  {
    id: "q_006",
    topic: "Trade-offs & Decision Making",
    text: "Describe a scenario where you had to make a major technical trade-off under tight deadlines. What factors did you weigh?",
    sampleAnswer:
      "We needed to ship search capabilities quickly. Rather than setting up a dedicated Elasticsearch cluster immediately, we leveraged PostgreSQL full-text search with GIN indexes as phase one.",
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
export function buildMockQuestion(index: number): MockQuestionData | null {
  const entry = MOCK_QUESTIONS[index];
  if (!entry) return null;

  return {
    ...entry,
    questionNumber: index + 1,
    totalQuestions: MOCK_QUESTIONS.length,
  };
}
