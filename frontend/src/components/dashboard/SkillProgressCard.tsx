import { cn } from "@/lib/utils";
import { SKILL_SCORES } from "@/data/dashboard.mock";
import type { DashboardSkill } from "@/types/dashboard.types";
import { SectionHeading } from "./SectionHeading";

const SKILL_TRENDS: Record<string, string> = {
  "Technical Knowledge": "+8%",
  "Problem Solving": "+6%",
  Communication: "+2%",
  Confidence: "+3%",
};

function SkillRow({ skill, hasData }: { skill: DashboardSkill; hasData: boolean }) {
  const trend = hasData ? SKILL_TRENDS[skill.name] : null;

  return (
    <li className="flex items-center gap-4 py-3">
      <div className="w-[7.5rem] min-w-0 sm:w-36">
        <span className="block truncate text-sm font-medium text-text">{skill.name}</span>
      </div>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background-secondary">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-base ease-premium motion-reduce:transition-none"
          style={{ width: `${hasData ? skill.score : 0}%` }}
        />
      </div>
      <div className="flex w-16 shrink-0 flex-col items-end">
        <span className="text-sm font-medium tabular-nums text-text">
          {hasData ? `${skill.score}%` : "—"}
        </span>
        {trend && <span className="text-[11px] text-text-muted">{trend}</span>}
      </div>
    </li>
  );
}

type SkillProgressCardProps = {
  hasData: boolean;
  className?: string;
};

export function SkillProgressCard({ hasData, className }: SkillProgressCardProps) {
  return (
    <section aria-label="Skill progress" className={className}>
      <SectionHeading
        title="Skill progress"
        actionLabel="Details"
        actionTo="/progress"
      />
      {hasData ? (
        <ul className="mt-2">
          {SKILL_SCORES.map((skill) => (
            <SkillRow key={skill.name} skill={skill} hasData={hasData} />
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm leading-6 text-text-secondary">
          Complete an interview to start a skill profile.
        </p>
      )}
    </section>
  );
}
