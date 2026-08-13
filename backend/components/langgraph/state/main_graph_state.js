const { z } = require("zod");
const {
  InterviewPlanSchema,
} = require("../../langchain/schemas/interviewPlan.schema");

const DifficultySchema = z.enum(["easy", "medium", "hard"]);

const RoundTypeSchema = z.enum([
  "resume",
  "dsa",
  "technical",
  "system_design",
  "behavioral",
]);

const PhaseSchema = z.enum([
  "initialization",
  "question_generation",
  "waiting_for_answer",
  "evaluation",
  "adaptation",
  "round_transition",
  "finalization",
]);

const StatusSchema = z.enum([
  "initializing",
  "active",
  "paused",
  "completed",
  "failed",
]);

const CurrentQuestionSchema = z.object({
  question: z.string(),
  questionType: z.string(),
  focusArea: z.string().nullable(),
  expectedSkills: z.array(z.string()),
});

const QuestionScoreSchema = z.object({
  roundIndex: z.number().int().nonnegative(),

  questionNumber: z.number().int().positive(),

  score: z.number().min(0).max(10),

  difficulty: DifficultySchema,

  topic: z.string().min(1),
});

const ResumeChunkSchema = z.object({
  chunkId: z.string(),

  text: z.string().min(1),

  similarity: z.number().min(0).max(1),
});

const InterviewErrorSchema = z.object({
  code: z.string(),

  message: z.string(),

  retryable: z.boolean(),
});

const ConversationMessageSchema = z.object({
  role: z.enum(["interviewer", "candidate"]),

  content: z.string(),
});

const InterviewState = z.object({
  interviewId: z.string(),

  userId: z.string(),

  resumeId: z.string(),

  role: z.string(),

  interviewPlan: InterviewPlanSchema,

  currentRoundNumber: z.number().int().positive(),

  currentQuestionNumber: z.number().int().positive(),

  currentQuestion: CurrentQuestionSchema.nullable(),

  currentAnswer: z.string().nullable(),

  resumeContext: z.array(ResumeChunkSchema).default([]),

  currentDifficulty: DifficultySchema,

  questionScores: z.array(QuestionScoreSchema).default([]),

  conversationHistory: z.array(ConversationMessageSchema).default([]),

  phase: PhaseSchema,

  status: StatusSchema,

  shouldContinue: z.boolean(),

  error: InterviewErrorSchema.nullable(),

  retryCount: z.number().int().nonnegative(),

  stateVersion: z.number().int().positive(),
});

module.exports = { InterviewState };
