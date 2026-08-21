import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PERFORMANCE_TREND, TREND_AVERAGE } from "@/data/dashboard.mock";
import { SectionHeading } from "./SectionHeading";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: number | string }>;
  label?: string;
}) {
  if (!active || !payload?.length || typeof payload[0]?.value === "undefined") return null;

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-card">
      <p className="text-xs font-medium text-text">{label}</p>
      <p className="text-xs text-text-secondary">
        Score <span className="font-medium text-text">{payload[0].value}%</span>
      </p>
    </div>
  );
}

export function PerformanceTrendCard({ className }: { className?: string }) {
  return (
    <section aria-label="Performance trend" className={className}>
      <SectionHeading
        title="Improvement over time"
        description={`Average score ${TREND_AVERAGE}%`}
      />
      <div className="mt-4 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={PERFORMANCE_TREND} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#98A2B3", fontFamily: "inherit" }}
              dy={8}
            />
            <YAxis
              domain={[50, 100]}
              ticks={[50, 70, 90, 100]}
              width={32}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#98A2B3", fontFamily: "inherit" }}
            />
            <ReferenceLine y={TREND_AVERAGE} stroke="#D1D5DB" strokeDasharray="4 4" />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: "#CBD5E1", strokeDasharray: "3 3" }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#4F46E5"
              strokeWidth={2}
              fill="#4F46E5"
              fillOpacity={0.08}
              activeDot={{ r: 3.5, strokeWidth: 2, stroke: "#FFFFFF", fill: "#4F46E5" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
