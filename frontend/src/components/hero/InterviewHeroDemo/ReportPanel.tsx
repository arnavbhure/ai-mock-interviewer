import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { ScoreRing } from "@/components/hero/InterviewHeroDemo/ScoreRing";
import { SkillProgress } from "@/components/hero/InterviewHeroDemo/SkillProgress";
import { RecommendationCard } from "@/components/hero/InterviewHeroDemo/RecommendationCard";
import type { SkillProgress as SkillProgressType } from "@/components/hero/types/hero.types";

type ReportPanelProps = {
  score: number;
  skills: SkillProgressType[];
  onViewFullReport: () => void;
};

export function ReportPanel({ score, skills, onViewFullReport }: ReportPanelProps) {
  return (
    <div className="space-y-5 rounded-[26px] border border-border/70 bg-card p-5 shadow-card">
      <div className="grid gap-5 lg:grid-cols-[auto_1fr] lg:items-center">
        <ScoreRing value={score} />

        <div className="space-y-4">
          {skills.map((skill) => (
            <SkillProgress key={skill.label} label={skill.label} value={skill.value} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[24px] border border-border/70 bg-secondary/60 p-5">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-success">
            <CheckCircle2 size={14} strokeWidth={1.75} />
            Strengths
          </div>
          <p className="mt-3 text-sm leading-7 text-foreground">
            Clear structure, strong project ownership, and steady problem-solving under pressure.
          </p>
        </div>

        <RecommendationCard
          recommendation="Hire"
          subtitle="The candidate shows enough depth, clarity, and ownership to progress confidently to the next stage."
        />
      </div>

      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        onClick={onViewFullReport}
        className="inline-flex h-12 items-center justify-center rounded-button bg-primary px-5 text-sm font-medium text-primary-foreground shadow-none transition-colors duration-250 ease-premium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        View Full Report
      </motion.button>
    </div>
  );
}
