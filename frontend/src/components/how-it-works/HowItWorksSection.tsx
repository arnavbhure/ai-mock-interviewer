import { motion, useReducedMotion } from "framer-motion";
import { TimelineItem } from "@/components/how-it-works/TimelineItem";
import { Timeline } from "@/components/how-it-works/Timeline";
import { InterviewPlanStep } from "@/components/how-it-works/steps/InterviewPlanStep";
import { InterviewStep } from "@/components/how-it-works/steps/InterviewStep";
import { ResumeStep } from "@/components/how-it-works/steps/ResumeStep";
import { ReportStep } from "@/components/how-it-works/steps/ReportStep";

export function HowItWorksSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-background py-20 text-foreground sm:py-24 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-border" />
        <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">How InterviewAI Works</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
            Practice smarter in just four simple steps.
          </h2>
        </motion.div>

        <div className="mt-10 lg:mt-14">
          <Timeline>
            <TimelineItem>
              <ResumeStep />
            </TimelineItem>
            <TimelineItem>
              <InterviewPlanStep />
            </TimelineItem>
            <TimelineItem>
              <InterviewStep />
            </TimelineItem>
            <TimelineItem>
              <ReportStep />
            </TimelineItem>
          </Timeline>
        </div>
      </div>
    </section>
  );
}
