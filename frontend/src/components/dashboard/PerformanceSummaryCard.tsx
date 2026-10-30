import { Link } from "react-router-dom";
import { ArrowRight, Award, CheckCircle2, PlayCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ParsedDashboardStats } from "@/types/dashboard.types";
import { SectionHeading } from "./SectionHeading";

type PerformanceSummaryCardProps = {
  stats?: ParsedDashboardStats;
  isLoading?: boolean;
  className?: string;
};

export function PerformanceSummaryCard({
  stats,
  isLoading,
  className,
}: PerformanceSummaryCardProps) {
  if (isLoading) {
    return (
      <section aria-label="Performance summary" className={className}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="mt-4 space-y-4 rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-2 w-full" />
          <div className="mt-6 space-y-3 pt-4 border-t border-border">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      </section>
    );
  }

  const hasData = Boolean(stats && stats.totalInterviews > 0);
  const avgScore = stats?.averageScore ?? 0;
  const scorePercent = Math.min(100, Math.max(0, Math.round(avgScore * 10)));
  const completed = stats?.completedInterviews ?? 0;
  const total = stats?.totalInterviews ?? 0;
  const strongHires = stats?.strongHireCount ?? 0;
  const activeCount = stats?.activeInterviews ?? 0;

  const strongHirePercent =
    completed > 0 ? Math.round((strongHires / completed) * 100) : 0;
  const completionPercent =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  const scoreTier =
    avgScore >= 8.0
      ? { label: "Strong Candidate", color: "text-emerald-500" }
      : avgScore >= 6.5
        ? { label: "Competitive", color: "text-indigo-500" }
        : avgScore > 0
          ? { label: "Developing", color: "text-amber-500" }
          : { label: "No Evaluations Yet", color: "text-text-muted" };

  return (
    <section aria-label="Performance summary" className={className}>
      <SectionHeading
        title="Evaluation Snapshot"
        actionLabel={hasData ? "Full history" : undefined}
        actionTo={hasData ? "/interviews" : undefined}
      />

      <div className="mt-4 rounded-xl border border-border bg-surface p-5">
        {hasData ? (
          <div className="space-y-5">
            {/* Average Rating Dial */}
            <div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-medium text-text-muted">
                    Average Evaluation
                  </span>
                  <p className={`mt-0.5 text-xs font-semibold ${scoreTier.color}`}>
                    {scoreTier.label}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold tracking-tight text-text tabular-nums">
                    {avgScore > 0 ? avgScore.toFixed(1) : "--"}
                  </span>
                  <span className="text-xs text-text-muted"> / 10</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-background-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3.5 border-t border-border pt-4 text-xs">
              {/* Strong Hires */}
              <div>
                <div className="flex items-center justify-between text-text">
                  <span className="flex items-center gap-1.5 font-medium text-text-secondary">
                    <Award className="size-3.5 text-emerald-500" />
                    Strong Hire Rate
                  </span>
                  <span className="font-semibold tabular-nums text-text">
                    {strongHirePercent}%
                    <span className="ml-1 text-text-muted font-normal">
                      ({strongHires}/{completed})
                    </span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-background-secondary">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${strongHirePercent}%` }}
                  />
                </div>
              </div>

              {/* Completion Rate */}
              <div>
                <div className="flex items-center justify-between text-text">
                  <span className="flex items-center gap-1.5 font-medium text-text-secondary">
                    <CheckCircle2 className="size-3.5 text-indigo-500" />
                    Completion Rate
                  </span>
                  <span className="font-semibold tabular-nums text-text">
                    {completionPercent}%
                    <span className="ml-1 text-text-muted font-normal">
                      ({completed}/{total})
                    </span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-background-secondary">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Active Interview Banner if exists */}
            {activeCount > 0 && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <PlayCircle className="size-4 shrink-0 text-primary" />
                    <p className="truncate text-xs font-medium text-text">
                      {activeCount} active interview in progress
                    </p>
                  </div>
                  <Link
                    to="/interview"
                    className="shrink-0 text-xs font-semibold text-primary hover:text-primary-bright flex items-center gap-1"
                  >
                    <span>Resume</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-2 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-background-secondary text-text-muted">
              <Award className="size-5" />
            </div>
            <p className="mt-3 text-sm font-medium text-text">No evaluations yet</p>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
              Complete your first interview to generate your evaluation score, hire probability, and detailed metrics.
            </p>
            <Link
              to="/dashboard/new"
              className="mt-3.5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-bright"
            >
              Start an interview
              <ArrowRight className="size-3" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

