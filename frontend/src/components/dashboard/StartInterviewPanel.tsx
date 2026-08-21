import { ArrowRight, History, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StartInterviewPanelProps = {
  hasData: boolean;
  className?: string;
};

const INTERVIEW_CONFIG = [
  { label: "Target Role", value: "Full Stack Developer" },
  { label: "Resume", value: "resume.pdf" },
  { label: "Difficulty", value: "Medium" },
  { label: "Interview Type", value: "Technical" },
] as const;

export function StartInterviewPanel({ hasData, className }: StartInterviewPanelProps) {
  return (
    <section
      aria-label="Start a new interview"
      className={cn(
        "rounded-lg border border-border bg-background-secondary/60 p-5 shadow-card sm:p-6",
        className,
      )}
    >
      {/* Title + subtitle */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          Start a New Interview
        </h2>
        <p className="text-sm leading-6 text-text-muted">
          Configure your interview and start practicing in seconds.
        </p>
      </div>

      {/* Compact structured fields — 2 columns on desktop, 1 on mobile */}
      <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        {INTERVIEW_CONFIG.map((item) => (
          <div key={item.label} className="min-w-0 border-t border-border/70 pt-3">
            <dt className="text-caption font-medium uppercase tracking-[0.08em] text-text-muted">
              {item.label}
            </dt>
            <dd className="mt-1 truncate text-[15px] font-medium text-text">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button asChild size="lg" className="group h-11 shrink-0 gap-2 px-6 text-[15px]">
          <Link to="/dashboard/new">
            <Play className="size-4 fill-current" aria-hidden="true" />
            Start Interview
            <ArrowRight
              className="size-4 transition-transform duration-base ease-premium group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </Button>

        {hasData && (
          <Button asChild variant="ghost" size="lg" className="h-11 shrink-0 gap-2 px-3">
            <Link to="/interviews">
              <History className="size-4" aria-hidden="true" />
              Browse previous interviews
            </Link>
          </Button>
        )}
      </div>

      {/* Contextual line */}
      <p className="mt-5 border-t border-border/70 pt-4 text-xs leading-5 text-text-muted">
        Questions will be personalized using your selected role and resume.
      </p>
    </section>
  );
}