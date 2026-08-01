const { z } = require("zod");

const RoundSchema = z.object({
  roundNumber: z.number().int().positive(),

  roundType: z.enum(["resume", "dsa", "technical", "behavioral"]),

  difficulty: z.enum(["easy", "medium", "hard"]),

  displayName: z.string(),

  objective: z.string(),

  numberOfQuestions: z.number().int().min(1).max(3),

  focusAreas: z.array(z.string()).default([]),
});

const InterviewPlanSchema = z.object({
  interviewTitle: z.string(),

  estimatedDuration: z.number().positive(),

  totalQuestions: z.number().positive(),

  rounds: z.array(RoundSchema).min(1).max(4),
});

module.exports = { InterviewPlanSchema };
