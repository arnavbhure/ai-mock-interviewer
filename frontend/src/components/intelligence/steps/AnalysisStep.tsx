import { INTELLIGENCE_DEMO } from "@/components/intelligence/demo.data";
import { StepLabel } from "@/components/intelligence/steps/StepLabel";

/** STEP 2 — what the AI understood from the resume. */
export function AnalysisStep() {
  const analysis = INTELLIGENCE_DEMO.analysis;

  return (
    <div className="w-full rounded-card border border-border bg-surface p-5 sm:p-6">
      <StepLabel>{analysis.label}</StepLabel>

      <dl className="mt-4 divide-y divide-border">
        {analysis.rows.map((row) => (
          <div
            key={row.title}
            className="flex items-baseline justify-between gap-6 py-3 first:pt-0 last:pb-0"
          >
            <dt className="text-xs text-text-muted">{row.title}</dt>
            <dd className="text-sm font-medium text-text">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}