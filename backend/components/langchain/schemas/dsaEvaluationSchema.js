const { z } = require("zod");

const dsaEvaluationSchema = z.object({
  score: z.number().int().min(0).max(10),

  correctness: z.string(),

  timeComplexity: z.string(),

  spaceComplexity: z.string(),

  strengths: z.array(z.string()),

  weaknesses: z.array(z.string()),

  feedback: z.string(),
});

module.exports = { dsaEvaluationSchema };
