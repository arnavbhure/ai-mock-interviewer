import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { RECENT_INTERVIEWS } from "@/data/dashboard.mock";
import type { InterviewStatus, RecentInterview } from "@/types/dashboard.types";
import { SectionHeading } from "./SectionHeading";

function StatusBadge({ status }: { status: InterviewStatus }) {
  const config = {
    completed: { label: "Completed", className: "bg-success/10 text-success" },
    in_progress: { label: "In progress", className: "bg-primary/10 text-primary" },
    scheduled: { label: "Scheduled", className: "bg-background-secondary text-text-secondary" },
  }[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

function InterviewRow({ interview }: { interview: RecentInterview }) {
  const completed = interview.status === "completed";

  return (
    <tr className="transition-colors duration-base ease-premium hover:bg-surface-elevated/60">
      <td className="px-5 py-3.5">
        <p className="truncate text-sm font-medium text-text">{interview.role}</p>
      </td>
      <td className="px-5 py-3.5 hidden sm:table-cell">
        <p className="truncate text-sm text-text-secondary">{interview.type}</p>
      </td>
      <td className="px-5 py-3.5 text-right font-semibold text-text tabular-nums">
        {completed ? `${interview.score}%` : <span className="text-text-muted">—</span>}
      </td>
      <td className="px-5 py-3.5 hidden md:table-cell">
        <p className="text-sm text-text-muted">{interview.date}</p>
      </td>
      <td className="px-5 py-3.5 hidden lg:table-cell">
        <StatusBadge status={interview.status} />
      </td>
      <td className="px-5 py-3.5 text-right">
        <Link
          to={completed ? "/reports" : "/interviews"}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4"
        >
          {completed ? "View Report" : "Continue"}
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={6} className="px-5 py-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="size-5 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </span>
          <h3 className="text-sm font-semibold text-text">
            You haven't completed an interview yet
          </h3>
          <p className="max-w-sm text-sm leading-6 text-text-muted">
            Start your first AI interview and get a detailed performance report covering
            technical knowledge, problem solving, communication, and confidence.
          </p>
          <Link
            to="/dashboard/new"
            className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4"
          >
            Start your first interview
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </td>
    </tr>
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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" role="table">
          <thead>
            <tr className="border-b border-border bg-background-secondary/40">
              <th className="px-5 py-2.5 text-left text-caption font-medium uppercase tracking-[0.08em] text-text-muted">
                Target Role
              </th>
              <th className="px-5 py-2.5 text-left text-caption font-medium uppercase tracking-[0.08em] text-text-muted hidden sm:table-cell">
                Interview Type
              </th>
              <th className="px-5 py-2.5 text-right text-caption font-medium uppercase tracking-[0.08em] text-text-muted">
                Score
              </th>
              <th className="px-5 py-2.5 text-left text-caption font-medium uppercase tracking-[0.08em] text-text-muted hidden md:table-cell">
                Date
              </th>
              <th className="px-5 py-2.5 text-left text-caption font-medium uppercase tracking-[0.08em] text-text-muted hidden lg:table-cell">
                Status
              </th>
              <th className="px-5 py-2.5 text-right text-caption font-medium uppercase tracking-[0.08em] text-text-muted">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {hasData ? (
              RECENT_INTERVIEWS.map((interview) => (
                <InterviewRow key={interview.id} interview={interview} />
              ))
            ) : (
              <EmptyState />
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}