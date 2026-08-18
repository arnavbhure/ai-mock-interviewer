const { z } = require("zod");

const AnswerEvaluationSchema = z.object({
  score: z.number().min(0).max(10),
  feedback: z.string().min(1).max(500),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
});

module.exports = { AnswerEvaluationSchema };
