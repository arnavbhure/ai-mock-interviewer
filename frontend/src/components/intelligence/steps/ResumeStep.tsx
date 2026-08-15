import { INTELLIGENCE_DEMO } from "@/components/intelligence/demo.data";
import { StepLabel } from "@/components/intelligence/steps/StepLabel";

/** STEP 1 — a minimal representation of the candidate resume. */
export function ResumeStep() {
  const resume = INTELLIGENCE_DEMO.resume;

  return (
    <div className="w-full rounded-card border border-border bg-surface p-5 sm:p-6">
      <StepLabel>{resume.label}</StepLabel>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-text-muted">
            Skills
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {resume.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-button border border-border bg-surface-elevated px-2.5 py-1 text-xs text-text-secondary"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-text-muted">
            Experience
          </p>
          <p className="mt-1 text-sm text-text">{resume.experience}</p>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-text-muted">
            Projects
          </p>
          <p className="mt-1 text-sm text-text">{resume.projects}</p>
        </div>
      </div>
    </div>
  );
}