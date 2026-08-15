/**
 * Static demo content for the "Interview Modes" section.
 *
 * TODO: When the real interview service is available, these mode
 * configurations will be driven by backend/API data instead of static copy.
 */

export type InterviewMode = {
  id: string;
  index: string;
  title: string;
  preview: {
    heading: string;
    difficulty: string;
    focus: readonly string[];
    example: string;
    statusLabel: string;
    statusNote: string;
    waveform: readonly number[];
  };
};

export const INTERVIEW_MODES: InterviewMode[] = [
  {
    id: "technical",
    index: "01",
    title: "Technical",
    preview: {
      heading: "Technical Interview",
      difficulty: "Medium",
      focus: [
        "Technical fundamentals",
        "Project decisions",
        "Architecture",
      ],
      example: "Why did you choose PostgreSQL for this project?",
      statusLabel: "Ready for your answer",
      statusNote: "Project-depth follow-ups are tuned around the systems you shipped.",
      waveform: [18, 30, 22, 40, 26, 34, 24, 38, 20, 32, 18, 28],
    },
  },
  {
    id: "dsa",
    index: "02",
    title: "DSA",
    preview: {
      heading: "DSA Interview",
      difficulty: "Medium",
      focus: ["Problem solving", "Algorithms", "Complexity"],
      example: "How would you optimize this solution?",
      statusLabel: "Ready for your answer",
      statusNote: "The interviewer is listening for reasoning, edge cases, and trade-offs.",
      waveform: [16, 24, 34, 22, 36, 28, 40, 26, 30, 20, 34, 18],
    },
  },
  {
    id: "system-design",
    index: "03",
    title: "System Design",
    preview: {
      heading: "System Design Interview",
      difficulty: "Advanced",
      focus: ["Architecture", "Scalability", "Trade-offs"],
      example: "Design a URL shortening service.",
      statusLabel: "Ready for your answer",
      statusNote: "Capacity assumptions and architecture trade-offs stay in view as you respond.",
      waveform: [22, 36, 18, 32, 24, 40, 28, 34, 20, 38, 24, 30],
    },
  },
  {
    id: "behavioral",
    index: "04",
    title: "Behavioral",
    preview: {
      heading: "Behavioral Interview",
      difficulty: "Core",
      focus: ["Communication", "Decision making", "Experience"],
      example: "Tell me about a time you handled a difficult situation.",
      statusLabel: "Ready for your answer",
      statusNote: "Responses are evaluated for clarity, ownership, reflection, and structure.",
      waveform: [14, 28, 20, 34, 18, 30, 22, 36, 16, 32, 20, 26],
    },
  },
];
