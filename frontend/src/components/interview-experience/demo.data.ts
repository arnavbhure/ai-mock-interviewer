/**
 * Static demo content for the landing-page interview demonstration.
 *
 * TODO: Replace with real interview session data (question, transcript,
 * follow-up) once the interview API is connected. This file is the single
 * source of truth for the demo copy so presentation stays separate from
 * future application state.
 */
export const DEMO_INTERVIEW = {
  question: "Tell me about a project where you had to solve a difficult technical problem.",
  candidateResponse:
    "I worked on redesigning the authentication flow to eliminate the cascading failures we saw under load.",
  listeningLabel: "AI Listening",
  followUp: "Why did you choose that approach?",
} as const;