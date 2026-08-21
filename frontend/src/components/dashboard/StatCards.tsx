import { cn } from "@/lib/utils";
import {
  DASHBOARD_STATS,
  EMPTY_DASHBOARD_STATS,
} from "@/data/dashboard.mock";

type StatCardsProps = {
  hasData: boolean;
  className?: string;
};

export function StatCards({ hasData, className }: StatCardsProps) {
  const stats = hasData ? DASHBOARD_STATS : EMPTY_DASHBOARD_STATS;

  return (
    <section aria-label="Current performance" className={className}>
      <h2 className="text-sm font-medium text-text">Performance</h2>
      <div className="mt-5 grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn("py-4 sm:py-0", index === 0 ? "sm:pr-8" : "sm:px-8", index === stats.length - 1 && "sm:pr-0")}
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
