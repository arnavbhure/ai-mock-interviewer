/**
 * Interview Service — Mock Implementation
 *
 * Clean API boundary for interview operations.
 * Every function returns a Promise so the calling code already
 * works with async patterns. Replace the bodies with real
 * fetch/axios calls when the backend is ready.
 */

import type { PreparationStep } from "@/types/interview.types";
import { PREPARATION_STEPS } from "@/types/interview.types";
import { buildMockQuestion } from "@/data/interview.mock";

// ─── Helpers ──────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Delays per preparation step — keeps the flow brisk but visible. */
const STEP_DELAYS: Record<PreparationStep, number> = {
  READING_RESUME: 600,
  UNDERSTANDING_EXPERIENCE: 700,
  STRUCTURING_PROFILE: 800,
  PREPARING_CONTEXT: 700,
  FINALIZING_INTERVIEW: 600,
};

// ─── Public API ───────────────────────────────────────────────

/**
 * Kick off a new interview session.
 * Returns the (mock) interview ID.
 */
export async function startInterview(): Promise<{ interviewId: string }> {
  await delay(300);
  return { interviewId: `iv_${Date.now().toString(36)}` };
}

/**
 * Run through all preparation steps, calling `onStep` as each
 * step completes.  This is the mock equivalent of polling or
 * subscribing to backend progress events.
 */
export async function runPreparationSequence(
  onStep: (step: PreparationStep) => void,
): Promise<void> {
  // Skip the last entry ("COMPLETE") — it's a terminal sentinel.
  const steps = PREPARATION_STEPS.slice(0, -1);

  for (const step of steps) {
    onStep(step);
    await delay(STEP_DELAYS[step]);
  }
}

/**
 * Fetch the current interview question by index.
 */
export async function getInterviewState(questionIndex: number) {
  await delay(200);
  const question = buildMockQuestion(questionIndex);
  return { question };
}

/**
 * Submit a candidate response for the current question.
 */
export async function submitResponse(
  _interviewId?: string,
  _questionId?: string,
  _transcript?: string,
): Promise<{ success: boolean }> {
  void _interviewId;
  void _questionId;
  void _transcript;
  await delay(400);
  return { success: true };
}

/**
 * End the interview session.
 */
export async function endInterview(
  _interviewId?: string,
): Promise<{ success: boolean }> {
  void _interviewId;
  await delay(300);
  return { success: true };
}
