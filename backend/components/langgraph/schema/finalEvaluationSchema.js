const { z } = require("zod");

const FinalEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(10),
  hireChance: z.enum(["Strong Hire", "Hire", "Weak Hire", "No Hire"]),
  summary: z.string().min(1),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
});

module.exports = { FinalEvaluationSchema };
