import { motion, useReducedMotion } from "framer-motion";
import { RadioTower } from "lucide-react";
import { StepCard } from "@/components/how-it-works/StepCard";
import { InterviewHeroDemo } from "@/components/hero/InterviewHeroDemo";

export function InterviewStep() {
  const reduceMotion = useReducedMotion();

  return (
    <StepCard
      step="03"
      title="Take the Interview"
      description="The live interview room adapts in real time with a pulsing recording indicator, waveform motion, and transcript typing."
    >
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[24px] border border-border bg-surface p-4 shadow-card">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            <RadioTower size={14} className="text-primary" />
            Live room
          </div>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            A simplified interview surface keeps the candidate focused while the system records, listens, and adapts.
          </p>
          <motion.div
            animate={reduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-error/20 bg-error/8 px-3 py-2 text-sm font-medium text-error"
          >
            <span className="size-2 rounded-full bg-error" />
            Recording in progress
          </motion.div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[18px] border border-border/70 bg-background px-4 py-3 text-sm text-foreground">
              Transcript types as the candidate answers.
            </div>
            <div className="rounded-[18px] border border-border/70 bg-background px-4 py-3 text-sm text-foreground">
              Questions change every few seconds based on the previous response.
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-border bg-card p-3 shadow-card sm:p-4">
          <InterviewHeroDemo />
        </div>
      </div>
    </StepCard>
  );
}
