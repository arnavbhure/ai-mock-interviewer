import { FeaturesSection } from "@/components/features-section";
import { HeroSection } from "@/components/hero";
import { HowItWorksSection } from "@/components/how-it-works";
import { IntelligenceSection } from "@/components/intelligence";
import { InterviewExperienceSection } from "@/components/interview-experience";
import { InterviewModesSection } from "@/components/interview-modes";

export function FoundationStatusPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-background text-foreground transition-colors duration-250 ease-premium">
      <HeroSection />
      <InterviewExperienceSection />
      <IntelligenceSection />
      <InterviewModesSection />
      <FeaturesSection />
      <HowItWorksSection />
    </main>
  );
}

