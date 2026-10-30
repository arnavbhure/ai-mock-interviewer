import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { ParsedInterviewStat } from "@/types/dashboard.types";
import { SectionHeading } from "./SectionHeading";

function formatInterviewDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

function StatusBadge({ status }: { status: string }) {
  const isCompleted = status.toLowerCase() === "completed";
  const isActive = status.toLowerCase() === "active" || status.toLowerCase() === "in_progress";

  if (isCompleted) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
        Completed
      </span>
    );
  }

  if (isActive) {
    return (
      <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-500">
        In progress
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-background-secondary px-2 py-0.5 text-xs font-medium text-text-muted">
      {status}
    </span>
  );
}

function HireChanceBadge({ chance }: { chance: string | null }) {
  if (!chance) return <span className="text-text-muted">—</span>;

  const lower = chance.toLowerCase();
  let color = "text-text-secondary bg-background-secondary";
  if (lower.includes("strong")) {
    color = "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20";
  } else if (lower.includes("no")) {
    color = "text-rose-500 bg-rose-500/10 border border-rose-500/20";
  } else if (lower.includes("weak")) {
    color = "text-amber-500 bg-amber-500/10 border border-amber-500/20";
  } else if (lower.includes("hire")) {
    color = "text-green-500 bg-green-500/10 border border-green-500/20";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        color,
      )}
    >
      {chance}
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const lower = difficulty.toLowerCase();
  const color =
    lower === "hard"
      ? "text-rose-500"
      : lower === "medium"
        ? "text-amber-500"
        : "text-emerald-500";

  return (
    <span className={cn("text-xs font-medium capitalize", color)}>
      {difficulty}
    </span>
  );
}

function InterviewRow({ interview }: { interview: ParsedInterviewStat }) {
  const isCompleted = interview.status.toLowerCase() === "completed";

  return (
    <tr className="transition-colors duration-base ease-premium hover:bg-background-secondary/70">
      {/* Role */}
      <td className="py-3.5 pr-4">
        <p className="truncate text-sm font-medium text-text">{interview.role}</p>
        <p className="mt-0.5 truncate text-xs text-text-muted sm:hidden">
          <DifficultyBadge difficulty={interview.difficulty} /> •{" "}
          {formatInterviewDate(interview.createdAt)}
        </p>
      </td>

      {/* Difficulty */}
      <td className="hidden py-3.5 pr-4 sm:table-cell">
        <DifficultyBadge difficulty={interview.difficulty} />
      </td>

      {/* Score */}
      <td className="py-3.5 pr-4 text-right text-sm font-medium tabular-nums text-text">
        {interview.overallScore !== null ? (
          <span>{interview.overallScore} / 10</span>
        ) : (
          <span className="text-text-muted">—</span>
        )}
      </td>

      {/* Hire Chance */}
      <td className="hidden py-3.5 pr-4 md:table-cell text-center">
        <HireChanceBadge chance={interview.hireChance} />
      </td>

      {/* Date */}
      <td className="hidden py-3.5 pr-4 lg:table-cell">
        <p className="text-xs text-text-muted">{formatInterviewDate(interview.createdAt)}</p>
      </td>

      {/* Status */}
      <td className="hidden py-3.5 pr-4 sm:table-cell">
        <StatusBadge status={interview.status} />
      </td>

      {/* Action */}
      <td className="py-3.5 text-right">
        <Link
          to={isCompleted ? "/reports" : "/interview"}
          className="text-sm font-medium text-primary transition-colors duration-base ease-premium hover:text-primary-bright"
        >
          {isCompleted ? "Report" : "Continue"}
        </Link>
      </td>
    </tr>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <tr key={i} className="border-b border-border">
          <td className="py-3.5 pr-4">
            <Skeleton className="h-4 w-32" />
          </td>
          <td className="hidden py-3.5 pr-4 sm:table-cell">
            <Skeleton className="h-4 w-14" />
          </td>
          <td className="py-3.5 pr-4 text-right">
            <Skeleton className="ml-auto h-4 w-12" />
          </td>
          <td className="hidden py-3.5 pr-4 md:table-cell">
            <Skeleton className="mx-auto h-4 w-16" />
          </td>
          <td className="hidden py-3.5 pr-4 lg:table-cell">
            <Skeleton className="h-4 w-14" />
          </td>
          <td className="hidden py-3.5 pr-4 sm:table-cell">
            <Skeleton className="h-4 w-16" />
          </td>
          <td className="py-3.5 text-right">
            <Skeleton className="ml-auto h-4 w-12" />
          </td>
        </tr>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={7} className="py-10 text-center sm:text-left">
        <p className="text-sm text-text">No interviews recorded yet</p>
        <p className="mt-1 max-w-md text-sm leading-6 text-text-secondary">
          Complete a session to see your evaluations, detailed scores, and hire recommendations here.
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
  interviews?: ParsedInterviewStat[];
  isLoading?: boolean;
  className?: string;
};

export function RecentInterviewsCard({
  interviews = [],
  isLoading,
  className,
}: RecentInterviewsCardProps) {
  const hasData = interviews.length > 0;

  return (
    <section aria-label="Recent interviews" className={className}>
      <SectionHeading
        title="Recent interviews"
        actionLabel={hasData ? "View all" : undefined}
        actionTo={hasData ? "/interviews" : undefined}
      />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse" role="table">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 pr-4 text-left text-xs font-medium text-text-muted">Role</th>
              <th className="hidden pb-2 pr-4 text-left text-xs font-medium text-text-muted sm:table-cell">
                Difficulty
              </th>
              <th className="pb-2 pr-4 text-right text-xs font-medium text-text-muted">Score</th>
              <th className="hidden pb-2 pr-4 text-center text-xs font-medium text-text-muted md:table-cell">
                Outcome
              </th>
              <th className="hidden pb-2 pr-4 text-left text-xs font-medium text-text-muted lg:table-cell">
                Date
              </th>
              <th className="hidden pb-2 pr-4 text-left text-xs font-medium text-text-muted sm:table-cell">
                Status
              </th>
              <th className="pb-2 text-right text-xs font-medium text-text-muted">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <SkeletonRows />
            ) : hasData ? (
              interviews.map((interview) => (
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
