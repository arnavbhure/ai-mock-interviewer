import { INTELLIGENCE_DEMO } from "@/components/intelligence/demo.data";
import { StepLabel } from "@/components/intelligence/steps/StepLabel";

/** STEP 4 — the adaptive follow-up, influenced by the candidate's answer. */
export function AdaptiveQuestionStep() {
  const followUp = INTELLIGENCE_DEMO.followUp;

  return (
    <div className="w-full rounded-card border border-border bg-surface p-5 sm:p-6">
      <StepLabel>{followUp.label}</StepLabel>

      <blockquote className="mt-4 border-l-2 border-primary pl-4">
        <p className="text-base leading-7 text-text sm:text-lg">
          “{followUp.question}”
        </p>
      </blockquote>
    </div>
  );
}