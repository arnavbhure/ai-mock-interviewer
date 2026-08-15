import { FinalCTA } from "@/components/final-cta";
import { GridBackground } from "@/components/ui/GridBackground";
import { HeroSection } from "@/components/hero";
import { IntelligenceSection } from "@/components/intelligence";
import { InterviewExperienceSection } from "@/components/interview-experience";
import { InterviewModesSection } from "@/components/interview-modes";

export function FoundationStatusPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-background text-foreground transition-colors duration-250 ease-premium">
      <GridBackground />
      <div className="relative z-10">
        <HeroSection />
        <InterviewExperienceSection />
        <IntelligenceSection />
        <InterviewModesSection />
        <FinalCTA />
      </div>
    </main>
  );
}
