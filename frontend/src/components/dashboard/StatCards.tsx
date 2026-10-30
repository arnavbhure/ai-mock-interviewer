import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { ParsedDashboardStats } from "@/types/dashboard.types";

type StatCardsProps = {
  stats?: ParsedDashboardStats;
  isLoading?: boolean;
  className?: string;
};

export function StatCards({ stats, isLoading, className }: StatCardsProps) {
  if (isLoading) {
    return (
      <section aria-label="Current performance" className={className}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="mt-5 grid grid-cols-1 divide-y divide-border sm:grid-cols-2 lg:grid-cols-4 sm:divide-y-0 sm:divide-x">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "py-4 sm:py-0",
                i === 0 ? "sm:pr-6" : "sm:px-6",
                i === 3 && "sm:pr-0",
              )}
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-8 w-16" />
              <Skeleton className="mt-2 h-3.5 w-32" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const avgScore = stats?.averageScore ?? 0;
  const completed = stats?.completedInterviews ?? 0;
  const total = stats?.totalInterviews ?? 0;
  const strongHires = stats?.strongHireCount ?? 0;
  const active = stats?.activeInterviews ?? 0;

  const statItems = [
    {
      label: "Average Score",
      value: avgScore > 0 ? `${avgScore.toFixed(1)} / 10` : "--",
      context:
        completed > 0
          ? "Across completed interviews"
          : "Complete a session to see score",
    },
    {
      label: "Completed Sessions",
      value: String(completed),
      context:
        total > 0
          ? `Out of ${total} total initiated`
          : "Complete your first session",
    },
    {
      label: "Strong Hires",
      value: String(strongHires),
      context:
        completed > 0
          ? `${Math.round((strongHires / (completed || 1)) * 100)}% high recommendation rate`
          : "Top-tier recommendations",
    },
    {
      label: "Active Sessions",
      value: String(active),
      context:
        active > 0
          ? "Ready to resume"
          : "No session in progress",
    },
  ];

  return (
    <section aria-label="Current performance" className={className}>
      <h2 className="text-sm font-medium text-text">Performance Overview</h2>
      <div className="mt-5 grid grid-cols-1 divide-y divide-border sm:grid-cols-2 lg:grid-cols-4 sm:divide-y-0 sm:divide-x">
        {statItems.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "py-4 sm:py-0",
              index === 0 ? "sm:pr-6" : "sm:px-6",
              index === statItems.length - 1 && "sm:pr-0",
            )}
          >
            <p className="text-xs text-text-muted">{stat.label}</p>
            <p className="mt-2 text-[2rem] font-semibold leading-none tracking-tight text-text tabular-nums">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-text-secondary">{stat.context}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
