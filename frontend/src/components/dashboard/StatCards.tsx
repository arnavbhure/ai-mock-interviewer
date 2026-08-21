import {
  DASHBOARD_STATS,
  EMPTY_DASHBOARD_STATS,
} from "@/data/dashboard.mock";
import { SectionHeading } from "./SectionHeading";

type StatCardsProps = {
  hasData: boolean;
  className?: string;
};

export function StatCards({ hasData, className }: StatCardsProps) {
  const stats = hasData ? DASHBOARD_STATS : EMPTY_DASHBOARD_STATS;

  return (
    <section aria-label="Performance overview" className={className}>
      <SectionHeading
        title="Performance Overview"
        description="A snapshot of your interview results"
      />
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-surface p-5 shadow-card"
          >
            <p className="truncate text-xs font-medium text-text-muted">{stat.label}</p>
            <p className="mt-2.5 text-[2rem] font-semibold leading-none tracking-tight text-text">
              {stat.value}
            </p>
            <p className="mt-2 text-xs leading-5 text-text-muted">{stat.context}</p>
          </div>
        ))}
      </div>
    </section>
  );
}