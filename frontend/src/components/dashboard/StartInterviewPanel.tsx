import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StartInterviewPanelProps = {
  hasData?: boolean;
  activeCount?: number;
  latestRole?: string;
  className?: string;
};

export function StartInterviewPanel({
  hasData = false,
  activeCount = 0,
  latestRole,
  className,
}: StartInterviewPanelProps) {
  const hasActiveSession = activeCount > 0;

  const config = [
    { label: "Target Role", value: latestRole || "Software Engineer" },
    { label: "Format", value: "Technical + DSA" },
    { label: "Evaluator", value: "Real-time AI Model" },
    { label: "Feedback", value: "Instant Rubric Scoring" },
  ];

  return (
    <section
      aria-label="Start a new interview"
      className={cn(
        "rounded-xl border border-border bg-surface px-5 py-6 sm:px-7 sm:py-7",
        className,
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium tracking-tight text-text">
              {hasActiveSession ? "Resume or start interview" : "Start a new interview"}
            </h2>
            {hasActiveSession && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                Active session ready
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            Configure your target role, upload a resume, and take a realistic adaptive interview.
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            {config.map((item) => (
              <div key={item.label} className="min-w-0">
                <dt className="text-xs text-text-muted">{item.label}</dt>
                <dd className="mt-1 truncate text-sm font-medium text-text">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
          {hasActiveSession ? (
            <>
              <Button asChild size="lg" className="group h-11 gap-2 px-5 text-[15px] bg-primary hover:bg-primary-bright">
                <Link to="/interview">
                  <Play className="size-4 fill-white text-white" />
                  Resume interview
                </Link>
              </Button>
              <Link
                to="/dashboard/new"
                className="inline-flex h-11 items-center justify-center px-2 text-sm font-medium text-text-secondary transition-colors duration-base ease-premium hover:text-text"
              >
                Start new instead
              </Link>
            </>
          ) : (
            <>
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
                  className="inline-flex h-11 items-center justify-center px-2 text-sm font-medium text-text-muted transition-colors duration-base ease-premium hover:text-text"
                >
                  Previous interviews
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
