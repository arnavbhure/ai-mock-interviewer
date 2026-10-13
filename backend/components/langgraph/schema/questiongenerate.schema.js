const { z } = require("zod");

const QuestionTypeEnum = z.enum([
  "introductory",
  "technical",
  "conceptual",
  "problem_solving",
  "project",
  "behavioral",
  "follow_up",
]);

const GeneratedQuestionSchema = z.object({
  question: z
    .string()
    .min(1)
    .catch("Can you elaborate on your technical background and key project experiences?"),

  questionType: z
    .preprocess((val) => {
      if (typeof val === "string") {
        const lower = val.toLowerCase().trim().replace(/[-\s]/g, "_");
        if (lower.includes("intro")) return "introductory";
        if (lower.includes("tech")) return "technical";
        if (lower.includes("concept")) return "conceptual";
        if (lower.includes("problem") || lower.includes("solving")) return "problem_solving";
        if (lower.includes("project")) return "project";
        if (lower.includes("behavior")) return "behavioral";
        if (lower.includes("follow")) return "follow_up";
        return lower;
      }
      return val;
    }, QuestionTypeEnum)
    .catch("technical"),

  focusArea: z
    .preprocess((val) => (val === undefined ? null : val), z.string().nullable().catch(null))
    .default(null),

  expectedSkills: z
    .preprocess((val) => (Array.isArray(val) ? val : []), z.array(z.string()))
    .default([]),
});

module.exports = { GeneratedQuestionSchema, QuestionTypeEnum };
