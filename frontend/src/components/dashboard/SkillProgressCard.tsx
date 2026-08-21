import { cn } from "@/lib/utils";
import { SKILL_SCORES } from "@/data/dashboard.mock";
import type { DashboardSkill } from "@/types/dashboard.types";
import { SectionHeading } from "./SectionHeading";

function SkillRow({ skill, hasData }: { skill: DashboardSkill; hasData: boolean }) {
  const change = hasData ? skill.change : 0;
  const positive = change >= 0;

  return (
    <li className="flex items-center gap-3 py-3">
      <span className="w-36 min-w-0 truncate text-sm font-medium text-text">
        {skill.name}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background-secondary">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-base ease-premium"
          style={{ width: `${hasData ? skill.score : 0}%` }}
        />
      </div>
      <span className="w-12 shrink-0 text-right text-sm font-semibold text-text">
        {hasData ? `${skill.score}%` : "--"}
      </span>
      <span
        className={cn(
          "w-10 shrink-0 text-right text-[11px] font-medium tabular-nums",
          hasData && positive ? "text-success" : hasData ? "text-error" : "text-text-muted",
        )}
        title={hasData ? `${positive ? "+" : "−"}${Math.abs(change)} pts vs previous period` : undefined}
      >
        {hasData ? `${positive ? "+" : "−"}${Math.abs(change)}` : "--"}
      </span>
    </li>
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
          description="Across your last 5 interviews"
          actionLabel="View progress"
          actionTo="/progress"
        />
      </div>
      <ul className="px-5 pt-1 divide-y divide-border">
        {SKILL_SCORES.map((skill) => (
          <SkillRow key={skill.name} skill={skill} hasData={hasData} />
        ))}
      </ul>
      {!hasData && (
        <p className="px-5 py-4 border-t border-border text-xs leading-5 text-text-muted">
          Complete your first interview to start building a skill profile.
        </p>
      )}
    </section>
  );
}