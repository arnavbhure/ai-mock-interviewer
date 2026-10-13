const { z } = require("zod");

const HireChanceEnum = z.enum(["Strong Hire", "Hire", "Weak Hire", "No Hire"]);

const FinalEvaluationSchema = z.object({
  overallScore: z
    .preprocess((val) => {
      const num = Number(val);
      return isNaN(num) ? 7 : Math.min(10, Math.max(0, num));
    }, z.number().min(0).max(10))
    .catch(7),

  hireChance: z
    .preprocess((val) => {
      if (typeof val === "string") {
        const lower = val.toLowerCase();
        if (lower.includes("strong")) return "Strong Hire";
        if (lower.includes("no")) return "No Hire";
        if (lower.includes("weak")) return "Weak Hire";
        return "Hire";
      }
      return "Hire";
    }, HireChanceEnum)
    .catch("Hire"),

  summary: z.string().min(1).catch("Overall solid interview performance."),

  strengths: z
    .preprocess((val) => (Array.isArray(val) ? val : []), z.array(z.string()))
    .default([])
    .catch([]),

  weaknesses: z
    .preprocess((val) => (Array.isArray(val) ? val : []), z.array(z.string()))
    .default([])
    .catch([]),

  recommendations: z
    .preprocess((val) => (Array.isArray(val) ? val : []), z.array(z.string()))
    .default([])
    .catch([]),
});

module.exports = { FinalEvaluationSchema };
