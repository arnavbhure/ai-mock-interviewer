import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SKILL_SCORES } from "@/data/dashboard.mock";
import type { DashboardSkill } from "@/types/dashboard.types";
import { SectionHeading } from "./SectionHeading";

const SKILL_TRENDS: Record<string, string> = {
  "Technical Knowledge": "+8% this month",
  "Problem Solving": "+6% this month",
  "Communication": "+2% this month",
  Confidence: "+3% this month",
};

function SkillRow({ skill, hasData }: { skill: DashboardSkill; hasData: boolean }) {
  const trend = hasData ? SKILL_TRENDS[skill.name] : null;

  return (
    <li className="flex items-center gap-3 py-3.5">
      <div className="w-32 min-w-0 flex flex-col">
        <span className="truncate text-sm font-medium text-text">{skill.name}</span>
        {hasData && trend && (
          <span className="text-[11px] font-medium text-success mt-0.5">{trend}</span>
        )}
      </div>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background-secondary">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-base ease-premium"
          style={{ width: `${hasData ? skill.score : 0}%` }}
        />
      </div>
      <span className="w-12 shrink-0 text-right text-sm font-semibold text-text tabular-nums">
        {hasData ? `${skill.score}%` : "—"}
      </span>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="px-5 py-8 text-center">
      <p className="text-sm leading-5 text-text-muted">
        Complete your first interview to start building a skill profile.
      </p>
    </div>
  );
}

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
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-hover">
      <p className="text-xs font-medium text-text">{label}</p>
      <p className="text-[11px] text-text-muted">
        Overall score: <span className="font-semibold text-text">{payload[0].value}%</span>
      </p>
    </div>
  );
}

function OverallTrendChart() {
  const trendData = [
    { label: "Int 1", score: 68 },
    { label: "Int 2", score: 73 },
    { label: "Int 3", score: 79 },
    { label: "Int 4", score: 82 },
  ];

  return (
    <div className="mt-6 pt-6 border-t border-border">
      <div className="flex items-center justify-between gap-4 px-5 pb-3">
        <div>
          <p className="text-caption font-medium text-text-muted">Overall score trend</p>
          <p className="text-sm font-semibold text-text">68 → 73 → 79 → 82</p>
        </div>
      </div>
      <div className="px-1">
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#98A2B3" }}
              dy={6}
            />
            <YAxis
              domain={[60, 90]}
              ticks={[60, 70, 80, 90]}
              width={28}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#98A2B3" }}
            />
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
              fillOpacity={0.1}
              activeDot={{ r: 3, strokeWidth: 2, stroke: "#FFFFFF", fill: "#4F46E5" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

type SkillProgressCardProps = {
  hasData: boolean;
  className?: string;
};

export function SkillProgressCard({ hasData, className }: SkillProgressCardProps) {
  return (
    <section
      aria-label="Skill progress"
      className={cn("overflow-hidden rounded-xl border border-border bg-surface shadow-card", className)}
    >
      <div className="px-5 py-4">
        <SectionHeading
          title="Skill Progress"
          description="How your interview skills are developing."
          actionLabel="View progress"
          actionTo="/progress"
        />
      </div>
      {hasData ? (
        <>
          <ul className="px-5 pt-1 divide-y divide-border">
            {SKILL_SCORES.map((skill) => (
              <SkillRow key={skill.name} skill={skill} hasData={hasData} />
            ))}
          </ul>
          <OverallTrendChart />
        </>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}