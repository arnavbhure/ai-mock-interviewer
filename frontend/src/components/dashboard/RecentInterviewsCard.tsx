import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RECENT_INTERVIEWS } from "@/data/dashboard.mock";
import type { InterviewStatus, RecentInterview } from "@/types/dashboard.types";
import { SectionHeading } from "./SectionHeading";

function StatusDot({ status }: { status: InterviewStatus }) {
  const config = {
    completed: { label: "Completed", dot: "bg-success", text: "text-success" },
    in_progress: { label: "In progress", dot: "bg-warning", text: "text-warning" },
    scheduled: { label: "Scheduled", dot: "bg-text-muted", text: "text-text-secondary" },
  }[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap", config.text)}>
      <span className={cn("size-1.5 rounded-full", config.dot)} aria-hidden="true" />
      {config.label}
    </span>
  );
}

function InterviewRow({ interview }: { interview: RecentInterview }) {
  const completed = interview.status === "completed";

  return (
    <li>
      <div className="flex items-center justify-between gap-3 py-3.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-text">{interview.role}</p>
          <p className="mt-0.5 text-xs text-text-muted">
            {interview.type} · {interview.date}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <StatusDot status={interview.status} />
          {completed ? (
            <span className="w-14 text-right text-sm font-semibold text-text">
              {interview.score}%
            </span>
          ) : null}
          <Link
            to={completed ? "/reports" : "/interviews"}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4"
          >
            {completed ? "View Report" : "Continue"}
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
      <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10">
        <Play className="size-5 text-primary" aria-hidden="true" />
      </span>
      <h3 className="text-sm font-semibold text-text">
        You haven't completed an interview yet
      </h3>
      <p className="max-w-sm text-sm leading-6 text-text-muted">
        Start your first AI interview and get a detailed performance report covering
        technical knowledge, problem solving, communication, and confidence.
      </p>
      <Button asChild size="sm" className="mt-1">
        <Link to="/dashboard/new">
          <Play className="size-3.5 fill-current" aria-hidden="true" />
          Start your first interview
        </Link>
      </Button>
    </div>
  );
}

type RecentInterviewsCardProps = {
  hasData: boolean;
  className?: string;
};

export function RecentInterviewsCard({ hasData, className }: RecentInterviewsCardProps) {
  return (
    <section
      aria-label="Recent interviews"
      className={cn("overflow-hidden rounded-xl border border-border bg-surface shadow-card", className)}
    >
      <div className="px-5 py-4">
        <SectionHeading
          title="Recent Interviews"
          description="Your latest practice sessions"
          actionLabel="View all"
          actionTo="/interviews"
        />
      </div>
      {hasData ? (
        <ul className="divide-y divide-border">
          {RECENT_INTERVIEWS.map((interview) => (
            <InterviewRow key={interview.id} interview={interview} />
          ))}
        </ul>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}