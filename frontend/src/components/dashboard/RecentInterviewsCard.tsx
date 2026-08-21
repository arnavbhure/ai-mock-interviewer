import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { RECENT_INTERVIEWS } from "@/data/dashboard.mock";
import type { InterviewStatus, RecentInterview } from "@/types/dashboard.types";
import { SectionHeading } from "./SectionHeading";

function StatusBadge({ status }: { status: InterviewStatus }) {
  const config = {
    completed: { label: "Completed", className: "text-success" },
    in_progress: { label: "In progress", className: "text-primary" },
    scheduled: { label: "Scheduled", className: "text-text-muted" },
  }[status];

  return (
    <span className={cn("text-xs font-medium whitespace-nowrap", config.className)}>
      {config.label}
    </span>
  );
}

function InterviewRow({ interview }: { interview: RecentInterview }) {
  const completed = interview.status === "completed";

  return (
    <tr className="transition-colors duration-base ease-premium hover:bg-background-secondary/70">
      <td className="py-3.5 pr-4">
        <p className="truncate text-sm font-medium text-text">{interview.role}</p>
        <p className="mt-0.5 truncate text-xs text-text-muted sm:hidden">{interview.type}</p>
      </td>
      <td className="hidden py-3.5 pr-4 sm:table-cell">
        <p className="truncate text-sm text-text-secondary">{interview.type}</p>
      </td>
      <td className="py-3.5 pr-4 text-right text-sm font-medium tabular-nums text-text">
        {completed ? `${interview.score}%` : <span className="text-text-muted">—</span>}
      </td>
      <td className="hidden py-3.5 pr-4 md:table-cell">
        <p className="text-xs text-text-muted">{interview.date}</p>
      </td>
      <td className="hidden py-3.5 pr-4 lg:table-cell">
        <StatusBadge status={interview.status} />
      </td>
      <td className="py-3.5 text-right">
        <Link
          to={completed ? "/reports" : "/interviews"}
          className="text-sm font-medium text-text-secondary transition-colors duration-base ease-premium hover:text-text"
        >
          {completed ? "Report" : "Continue"}
        </Link>
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={6} className="py-10">
        <p className="text-sm text-text">No interviews yet</p>
        <p className="mt-1 max-w-md text-sm leading-6 text-text-secondary">
          Complete a session to see scores, reports, and progress here.
        </p>
        <Link
          to="/dashboard/new"
          className="mt-3 inline-flex text-sm font-medium text-primary hover:text-primary-bright"
        >
          Start your first interview
        </Link>
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
    <section aria-label="Recent interviews" className={className}>
      <SectionHeading
        title="Recent interviews"
        actionLabel="View all"
        actionTo="/interviews"
      />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse" role="table">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 pr-4 text-left text-xs font-medium text-text-muted">Role</th>
              <th className="hidden pb-2 pr-4 text-left text-xs font-medium text-text-muted sm:table-cell">
                Type
              </th>
              <th className="pb-2 pr-4 text-right text-xs font-medium text-text-muted">Score</th>
              <th className="hidden pb-2 pr-4 text-left text-xs font-medium text-text-muted md:table-cell">
                Date
              </th>
              <th className="hidden pb-2 pr-4 text-left text-xs font-medium text-text-muted lg:table-cell">
                Status
              </th>
              <th className="pb-2 text-right text-xs font-medium text-text-muted">
                <span className="sr-only">Action</span>
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
