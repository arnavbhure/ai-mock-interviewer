const { z } = require("zod");

const ResumeSchema = z.object({
  fullName: z.string().nullable(),

  email: z.string().nullable(),

  phone: z.string().nullable(),

  summary: z.string().nullable(),

  skills: z.array(z.string()),

  education: z.array(z.string()),

  experience: z.array(z.string()),

  projects: z.array(z.string()),

  achievments: z.string(),
});

module.exports = { ResumeSchema };
