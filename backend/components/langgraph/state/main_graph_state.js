const { z } = require("zod");
const {
  InterviewPlanSchema,
} = require("../../langchain/schemas/interviewPlan.schema");
const { AnswerEvaluationSchema } = require("../schema/answerEvaluationSchema");
const { FinalEvaluationSchema } = require("../schema/finalEvaluationSchema");

/* =========================
   ENUMS
========================= */

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

/* =========================
   CURRENT QUESTION
========================= */

const CurrentQuestionSchema = z.object({
  question: z.string(),

  questionType: z.string(),

  focusArea: z.string().nullable(),

  expectedSkills: z.array(z.string()),
});

/* =========================
   QUESTION SCORE
========================= */

const QuestionScoreSchema = z.object({
  roundIndex: z.number().int().nonnegative(),

  questionNumber: z.number().int().positive(),

  score: z.number().min(0).max(10),

  difficulty: DifficultySchema,

  topic: z.string().min(1),
});

/* =========================
   RESUME CONTEXT
========================= */

const ResumeChunkSchema = z.object({
  chunkId: z.string(),

  text: z.string().min(1),

  similarity: z.number().min(0).max(1),
});

/* =========================
   ERROR
========================= */

const InterviewErrorSchema = z.object({
  code: z.string(),

  message: z.string(),

  retryable: z.boolean(),
});

/* =========================
   CONVERSATION
========================= */

const ConversationMessageSchema = z.object({
  role: z.enum(["interviewer", "candidate"]),

  content: z.string(),
});

/* =========================
   MAIN INTERVIEW STATE
========================= */

const InterviewState = z.object({
  /* Identity */

  interviewId: z.string(),

  userId: z.string(),

  resumeId: z.string(),

  role: z.string(),

  /* Interview plan */

  interviewPlan: InterviewPlanSchema,

  /* Progress */

  currentRoundNumber: z.number().int().positive(),

  currentQuestionNumber: z.number().int().positive(),

  /* Current interaction */

  currentQuestion: CurrentQuestionSchema.nullable(),

  currentAnswer: z.string().nullable(),

  /* Evaluation */

  lastEvaluation: AnswerEvaluationSchema.nullable(),

  questionScores: z.array(QuestionScoreSchema).default([]),

  /* Resume */

  resumeContext: z.array(ResumeChunkSchema).default([]),

  /* Difficulty */

  currentDifficulty: DifficultySchema,

  /* Conversation */

  conversationHistory: z.array(ConversationMessageSchema).default([]),

  /* Graph control */

  phase: PhaseSchema,

  status: StatusSchema,

  shouldContinue: z.boolean(),

  /* Error handling */

  error: InterviewErrorSchema.nullable(),

  retryCount: z.number().int().nonnegative(),

  /* for final evaluation */

  finalEvaluation: FinalEvaluationSchema.nullable(),

  /* State version */

  stateVersion: z.number().int().positive(),
});

module.exports = {
  InterviewState,
  AnswerEvaluationSchema,
  DifficultySchema,
  RoundTypeSchema,
  PhaseSchema,
  StatusSchema,
  CurrentQuestionSchema,
  QuestionScoreSchema,
  ResumeChunkSchema,
  InterviewErrorSchema,
  ConversationMessageSchema,
};
