const { z } = require("zod");

const GeneratedQuestionSchema = z.object({
  question: z.string().min(1),

  questionType: z.enum([
    "introductory",
    "technical",
    "conceptual",
    "problem_solving",
    "project",
    "behavioral",
    "follow_up",
  ]),

  focusArea: z.string().nullable(),

  expectedSkills: z.array(z.string()),
});

module.exports = { GeneratedQuestionSchema };
