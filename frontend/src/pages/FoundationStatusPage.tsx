import { FeaturesSection } from "@/components/features-section";
import { HeroSection } from "@/components/hero";
import { HowItWorksSection } from "@/components/how-it-works";
import { InterviewExperienceSection } from "@/components/interview-experience";

export function FoundationStatusPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-background text-foreground transition-colors duration-250 ease-premium">
      <HeroSection />
      <InterviewExperienceSection />
      <FeaturesSection />
      <HowItWorksSection />
    </main>
  );
}

