const { z } = require("zod");

const RoundTypeEnum = z.enum(["resume", "dsa", "technical", "behavioral"]);
const DifficultyEnum = z.enum(["easy", "medium", "hard"]);

const InterviewRoundSchema = z.object({
  roundNumber: z
    .number()
    .int()
    .min(1)
    .describe("1-based sequence number for this round"),
  roundType: RoundTypeEnum.describe(
    "Exact round category: resume, dsa, technical, or behavioral",
  ),
  difficulty: DifficultyEnum.describe(
    "Difficulty level for this round: easy, medium, or hard",
  ),
  displayName: z
    .string()
    .min(1)
    .describe(
      "Human-readable title (e.g., 'Resume Overview', 'Technical Interview')",
    ),
  objective: z
    .string()
    .min(1)
    .describe("Core goal and assessment criteria for this round"),
  numberOfQuestions: z
    .number()
    .int()
    .min(1)
    .max(10)
    .describe("Total questions to ask in this round"),
  focusAreas: z
    .array(z.string())
    .default([])
    .describe("Specific topics, technologies, or skills to evaluate"),
});

const InterviewPlanSchema = z.object({
  interviewTitle: z
    .string()
    .min(1)
    .describe("Title of the interview tailored to the role"),
  estimatedDuration: z
    .number()
    .int()
    .min(5)
    .max(120)
    .describe("Total estimated duration in minutes"),
  totalQuestions: z
    .number()
    .int()
    .min(1)
    .max(30)
    .describe("Sum of questions across all rounds"),
  rounds: z
    .array(InterviewRoundSchema)
    .min(1)
    .max(6)
    .describe("Ordered array of interview rounds"),
});

module.exports = {
  RoundTypeEnum,
  DifficultyEnum,
  InterviewRoundSchema,
  InterviewPlanSchema,
};
