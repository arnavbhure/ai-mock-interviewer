import { HeroSection } from "@/components/hero";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorksSection } from "@/components/how-it-works";
import { Footer } from "@/components/footer";
import { PremiumNavbar } from "@/components/navigation/PremiumNavbar";

export function FoundationStatusPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-background text-foreground transition-colors duration-250 ease-premium">
      <div id="top">
        <PremiumNavbar />
      </div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </main>
  );
}
