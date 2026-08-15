import { INTELLIGENCE_DEMO } from "@/components/intelligence/demo.data";
import { StepLabel } from "@/components/intelligence/steps/StepLabel";

type AnswerIndicator = {
  label: string;
  value: number;
};

function IndicatorRow({ indicator }: { indicator: AnswerIndicator }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-xs text-text-muted">{indicator.label}</span>
      <span
        aria-hidden="true"
        className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-elevated"
      >
        <span
          className="block h-full rounded-full bg-primary/80"
          style={{ width: `${indicator.value}%` }}
        />
      </span>
    </div>
  );
}

/** STEP 3 — the candidate's answer, then the quiet analysis indicators. */
export function AnswerAnalysisStep() {
  const answer = INTELLIGENCE_DEMO.answer;

  return (
    <div className="w-full rounded-card border border-border bg-surface p-5 sm:p-6">
      <StepLabel>{answer.label}</StepLabel>

      <p className="mt-3 text-base leading-7 text-text">“{answer.text}”</p>

      <div className="mt-5 space-y-3 border-t border-border pt-4">
        {answer.indicators.map((indicator) => (
          <IndicatorRow key={indicator.label} indicator={indicator} />
        ))}
      </div>
    </div>
  );
}