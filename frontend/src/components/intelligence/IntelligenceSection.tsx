import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { IntelligenceIntro } from "@/components/intelligence/IntelligenceIntro";
import { IntelligenceStage } from "@/components/intelligence/IntelligenceStage";
import { revealUp } from "@/components/intelligence/animations/variants";
import { useIsDesktop } from "@/components/intelligence/hooks/useIsDesktop";
import { useSequenceStep } from "@/components/intelligence/hooks/useSequenceStep";
import { ResumeStep } from "@/components/intelligence/steps/ResumeStep";
import { AnalysisStep } from "@/components/intelligence/steps/AnalysisStep";
import { AnswerAnalysisStep } from "@/components/intelligence/steps/AnswerAnalysisStep";
import { AdaptiveQuestionStep } from "@/components/intelligence/steps/AdaptiveQuestionStep";
import { StepArrow } from "@/components/intelligence/steps/StepArrow";

const STEP_COUNT = 4;

/**
 * "It doesn't just ask. It understands."
 *
 * Desktop: a 280vh scroll lane locks a sticky scene — the heading stays stable
 * while the right stage progresses Resume → Analysis → Answer → Follow-up.
 * Mobile / reduced-motion: heading first, then normal stacked scrolling.
 */
export function IntelligenceSection() {
  const reducedMotion = Boolean(useReducedMotion());
  const isDesktop = useIsDesktop();

  if (reducedMotion) {
    return (
      <section id="intelligence" className="relative overflow-hidden bg-background">
        <StackedSteps animated={false} />
      </section>
    );
  }

  if (!isDesktop) {
    return (
      <section id="intelligence" className="relative overflow-hidden bg-background">
        <StackedSteps animated />
      </section>
    );
  }

  return (
    <section id="intelligence" className="relative bg-background">
      <DesktopScene />
    </section>
  );
}

/** Desktop: sticky heading + scroll-driven stage inside a 280vh lane. */
function DesktopScene() {
  const { containerRef, activeIndex } = useSequenceStep(STEP_COUNT);

  return (
    <div ref={containerRef} className="relative h-[280vh]">
      <div className="sticky top-0 flex min-h-[max(100svh,700px)] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-[1fr_1.15fr] items-center gap-10 px-4 sm:px-6 lg:px-8 lg:gap-16">
          <IntelligenceIntro />
          <IntelligenceStage activeIndex={activeIndex} />
        </div>
      </div>
    </div>
  );
}

/** Mobile / reduced-motion: heading first, then stacked steps in normal flow. */
function StackedSteps({ animated }: { animated: boolean }) {
  const steps = [
    <ResumeStep key="resume" />,
    <AnalysisStep key="analysis" />,
    <AnswerAnalysisStep key="answer" />,
    <AdaptiveQuestionStep key="follow-up" />,
  ];

  return (
    <div className="py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <IntelligenceIntro />

        <div className="mt-12">
          {steps.map((step, index) => (
            <div key={index}>
              <StepReveal animated={animated}>{step}</StepReveal>
              {index < steps.length - 1 && <StepArrow />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepReveal({ animated, children }: { animated: boolean; children: ReactNode }) {
  if (!animated) {
    return <div>{children}</div>;
  }
  return (
    <motion.div
      variants={revealUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}