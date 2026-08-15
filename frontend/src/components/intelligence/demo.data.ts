/**
 * Static demo content for the "It doesn't just ask. It understands." section.
 *
 * TODO: Replace with real candidate data — resume parsing + answer analysis +
 * adaptive follow-ups come from the resume/interview/AI APIs once connected.
 * Keep demo copy here, separate from the UI components.
 */
export const INTELLIGENCE_DEMO = {
  resume: {
    label: "Your Resume",
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    experience: "Full Stack Developer",
    projects: "AI Interview Platform",
  },
  analysis: {
    label: "AI Analysis",
    rows: [
      { title: "Skills detected", value: "Backend Development" },
      { title: "Experience detected", value: "Full Stack Development" },
      { title: "Interview focus", value: "Technical depth" },
    ],
  },
  answer: {
    label: "Candidate Answer",
    text: "I chose PostgreSQL because the application required strong relational integrity and reliable query performance under heavy concurrent load.",
    indicators: [
      { label: "Technical depth", value: 80 },
      { label: "Clarity", value: 90 },
      { label: "Confidence", value: 70 },
    ],
  },
  followUp: {
    label: "Follow-up Question",
    question: "You mentioned PostgreSQL. Why did you choose it over MongoDB for this project?",
  },
} as const;