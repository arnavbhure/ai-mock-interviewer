const { z } = require("zod");

const AnswerEvaluationSchema = z.object({
  score: z
    .preprocess((val) => {
      const num = Number(val);
      return isNaN(num) ? 7 : Math.min(10, Math.max(0, num));
    }, z.number().min(0).max(10))
    .catch(7),
  feedback: z
    .preprocess((val) => {
      if (typeof val === "string") return val.slice(0, 1000);
      return val;
    }, z.string().min(1))
    .catch(
      "The candidate provided a relevant response addressing the question.",
    ),
  strengths: z
    .preprocess((val) => (Array.isArray(val) ? val : []), z.array(z.string()))
    .default([])
    .catch([]),
  weaknesses: z
    .preprocess((val) => (Array.isArray(val) ? val : []), z.array(z.string()))
    .default([])
    .catch([]),
});

module.exports = { AnswerEvaluationSchema };
