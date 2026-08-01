import { AdaptiveCard } from "@/components/features-section/cards/AdaptiveCard";
import { AnalyticsCard } from "@/components/features-section/cards/AnalyticsCard";
import { CompanyCard } from "@/components/features-section/cards/CompanyCard";
import { InterviewCard } from "@/components/features-section/cards/InterviewCard";
import { ResumeCard } from "@/components/features-section/cards/ResumeCard";
import { ReportCard } from "@/components/features-section/cards/ReportCard";
import { VoiceAnalysisCard } from "@/components/features-section/cards/VoiceAnalysisCard";

export function FeaturesGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12 xl:auto-rows-[minmax(280px,auto)]">
      <ResumeCard />
      <InterviewCard />
      <AdaptiveCard />
      <VoiceAnalysisCard />
      <ReportCard />
      <CompanyCard />
      <AnalyticsCard />
    </div>
  );
}
