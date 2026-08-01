import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecommendationCard } from "@/components/hero/InterviewHeroDemo/RecommendationCard";
import { ScoreRing } from "@/components/hero/InterviewHeroDemo/ScoreRing";
import { SkillProgress } from "@/components/hero/InterviewHeroDemo/SkillProgress";
import { StepCard } from "@/components/how-it-works/StepCard";

const skillBars = [
  { label: "Technical depth", value: 93 },
  { label: "Communication", value: 88 },
  { label: "Problem solving", value: 95 },
];

const strengths = ["Strong project ownership", "Clear tradeoff reasoning"];

export function ReportStep() {
  const reduceMotion = useReducedMotion();

  return (
    <StepCard
      step="04"
      title="Receive Detailed Feedback"
      description="Every interview ends with a hiring-grade report, highlighting strengths, recommendations, and a clear path to improve."
    >
      <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-[24px] border border-border bg-surface p-4 shadow-card"
        >
          <div className="flex items-center justify-center rounded-[22px] border border-border/70 bg-background p-4">
            <ScoreRing value={94} />
          </div>
          <div className="mt-4 space-y-3">
            {skillBars.map((skill) => (
              <SkillProgress key={skill.label} {...skill} />
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {strengths.map((strength) => (
              <div key={strength} className="rounded-[22px] border border-border/70 bg-card p-4">
                <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-success">
                  <CheckCircle2 size={14} strokeWidth={1.75} />
                  Strength
                </div>
                <p className="mt-3 text-sm leading-7 text-foreground">{strength}</p>
              </div>
            ))}
          </div>

          <RecommendationCard
            recommendation="Strong Hire"
            subtitle="The candidate demonstrates enough technical depth, clarity, and ownership to move forward with confidence."
          />

          <Button variant="primary" className="w-full sm:w-fit">
            <Download size={16} />
            Download Report
          </Button>
        </div>
      </div>
    </StepCard>
  );
}
