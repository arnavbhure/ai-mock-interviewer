import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StartInterviewPanelProps = {
  hasData: boolean;
  className?: string;
};

const INTERVIEW_CONFIG = [
  { label: "Target role", value: "Full Stack Developer" },
  { label: "Resume", value: "resume.pdf" },
  { label: "Difficulty", value: "Medium" },
  { label: "Interview type", value: "Technical" },
] as const;

export function StartInterviewPanel({ hasData, className }: StartInterviewPanelProps) {
  return (
    <section
      aria-label="Start a new interview"
      className={cn(
        "rounded-lg border border-border bg-primary/5 p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex">
          <span className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="size-[18px] text-primary" aria-hidden="true" />
          </span>
          <div className="ml-3 min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-text">
              Start a new interview
            </h2>
            <p className="mt-1 text-sm leading-6 text-text-muted">
              Pick up with your current profile or tailor a fresh session for your target role.
            </p>
          </div>
        </div>
        <Button asChild size="lg" className="group h-11 shrink-0 gap-2 self-start px-6 text-[15px]">
          <Link to="/dashboard/new">
            {hasData ? "Start Interview" : "Start your first interview"}
            <ArrowRight
              className="size-4 transition-transform duration-base ease-premium group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </Button>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        {INTERVIEW_CONFIG.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="truncate text-caption text-text-muted">{item.label}</dt>
            <dd className="mt-1 truncate text-sm font-medium text-text">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}