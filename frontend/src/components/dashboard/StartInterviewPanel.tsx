import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StartInterviewPanelProps = {
  hasData: boolean;
  className?: string;
};

const INTERVIEW_CONFIG = [
  { label: "Role", value: "Full Stack Developer" },
  { label: "Resume", value: "resume.pdf" },
  { label: "Difficulty", value: "Medium" },
  { label: "Type", value: "Technical" },
] as const;

export function StartInterviewPanel({ hasData, className }: StartInterviewPanelProps) {
  return (
    <section
      aria-label="Start a new interview"
      className={cn("rounded-xl border border-border bg-surface px-5 py-6 sm:px-7 sm:py-7", className)}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-medium tracking-tight text-text">Start a new interview</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Uses your current role, resume, and difficulty.
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            {INTERVIEW_CONFIG.map((item) => (
              <div key={item.label} className="min-w-0">
                <dt className="text-xs text-text-muted">{item.label}</dt>
                <dd className="mt-1 truncate text-sm font-medium text-text">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
          <Button asChild size="lg" className="group h-11 gap-2 px-5 text-[15px]">
            <Link to="/dashboard/new">
              Start interview
              <ArrowRight
                className="size-4 transition-transform duration-base ease-premium group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </Button>
          {hasData && (
            <Link
              to="/interviews"
              className="inline-flex h-11 items-center justify-center px-2 text-sm font-medium text-text-secondary transition-colors duration-base ease-premium hover:text-text"
            >
              Previous interviews
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
