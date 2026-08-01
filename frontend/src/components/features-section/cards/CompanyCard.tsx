import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FeatureCard } from "@/components/features-section/FeatureCard";

const companies = ["Google", "Amazon", "Microsoft", "Meta"];

export function CompanyCard() {
  const [companyIndex, setCompanyIndex] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCompanyIndex((current) => (current + 1) % companies.length);
    }, 2400);

    return () => window.clearInterval(timerId);
  }, []);

  return (
    <FeatureCard
      index={5}
      eyebrow="Company-specific"
      title="Company-specific interviews"
      description="Switch the interview to the target company and tune the pace, depth, and evaluation style instantly."
      className="xl:col-span-4"
    >
      <div className="flex h-full flex-col justify-between rounded-[22px] border border-border/70 bg-background p-4">
        <div className="grid grid-cols-2 gap-2">
          {companies.map((company, index) => {
            const isActive = index === companyIndex;

            return (
              <div
                key={company}
                className={`rounded-[18px] border px-3 py-4 text-center text-sm font-medium transition-colors ${
                  isActive ? "border-primary/25 bg-primary/8 text-primary" : "border-border/70 bg-card text-muted-foreground"
                }`}
              >
                {company}
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-[22px] border border-border/70 bg-card p-4 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={companies[companyIndex]}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg font-semibold tracking-[-0.02em] text-foreground"
            >
              Tailored for {companies[companyIndex]}
            </motion.p>
          </AnimatePresence>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Company-specific prompts keep the interview aligned with real hiring expectations.
          </p>
        </div>
      </div>
    </FeatureCard>
  );
}
