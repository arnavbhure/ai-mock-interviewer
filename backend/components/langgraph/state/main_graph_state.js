const { z } = require("zod");

const DifficultySchema = z.enum(["easy", "medium", "hard"]);

const RoundTypeSchema = z.enum([
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

const InterviewRoundSchema = z.object({
  type: RoundTypeSchema,

  objective: z.string().min(1),

  targetQuestions: z.number().int().positive(),

  topics: z.array(z.string().min(1)).min(1),
});

const InterviewPlanSchema = z.object({
  version: z.number().int().positive(),

  rounds: z.array(InterviewRoundSchema).min(1),
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

const InterviewState = z.object({
  // Identity
  interviewId: z.string(),

  userId: z.string(),

  resumeId: z.string(),

  // Interview Plan
  interviewPlan: InterviewPlanSchema,

  // Current Position
  currentRoundIndex: z.number().int().nonnegative(),

  currentQuestionNumber: z.number().int().nonnegative(),

  // Adaptive Difficulty
  currentDifficulty: DifficultySchema,

  // Performance
  questionScores: z.array(QuestionScoreSchema),

  // Resume RAG Context
  relevantResumeChunks: z.array(ResumeChunkSchema),

  // Graph Execution
  phase: PhaseSchema,

  status: StatusSchema,

  shouldContinue: z.boolean(),

  // Error / Recovery
  error: InterviewErrorSchema.nullable(),

  retryCount: z.number().int().nonnegative(),

  // State Version
  stateVersion: z.number().int().positive(),
});

module.exports = { InterviewState };
