import { FeatureCard } from "@/components/features-section/FeatureCard";
import { RecommendationCard } from "@/components/hero/InterviewHeroDemo/RecommendationCard";
import { ScoreRing } from "@/components/hero/InterviewHeroDemo/ScoreRing";
import { SkillProgress } from "@/components/hero/InterviewHeroDemo/SkillProgress";

const reportSkills = [
  { label: "Technical depth", value: 91 },
  { label: "Communication", value: 87 },
  { label: "Problem solving", value: 94 },
];

export function ReportCard() {
  return (
    <FeatureCard
      index={4}
      eyebrow="Performance reports"
      title="Detailed performance reports"
      description="Every interview ends with a hiring-grade report that highlights strengths, weaknesses, and next steps."
      className="xl:col-span-6"
    >
      <div className="grid h-full gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex items-center justify-center rounded-[22px] border border-border/70 bg-background p-4">
          <ScoreRing value={92} />
        </div>

        <div className="grid gap-4">
          <div className="rounded-[22px] border border-border/70 bg-card p-4">
            <div className="space-y-3">
              {reportSkills.map((skill) => (
                <SkillProgress key={skill.label} {...skill} />
              ))}
            </div>
          </div>

          <RecommendationCard
            recommendation="Strong Hire"
            subtitle="The candidate shows strong reasoning, clear communication, and consistent technical ownership."
          />
        </div>
      </div>
    </FeatureCard>
  );
}
