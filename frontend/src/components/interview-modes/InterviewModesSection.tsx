import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { InterviewModesHeader } from "@/components/interview-modes/InterviewModesHeader";
import { ModePreview } from "@/components/interview-modes/ModePreview";
import { ModeSelector } from "@/components/interview-modes/ModeSelector";
import { INTERVIEW_MODES } from "@/components/interview-modes/modes.data";

export function InterviewModesSection() {
  const reducedMotion = Boolean(useReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);

  const mode = INTERVIEW_MODES[activeIndex];
  const previewId = `interview-mode-preview-${mode.id}`;

  return (
    <section
      id="interview-modes"
      className="relative border-t border-border bg-background text-foreground"
    >
      <div className="mx-auto w-full max-w-[1280px] px-5 py-24 sm:py-28 md:px-8 lg:py-[120px]">
        <InterviewModesHeader />

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <ModeSelector
              modes={INTERVIEW_MODES}
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
              previewId={previewId}
            />
          </motion.div>

          <motion.div
            key={mode.id}
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="min-w-0"
          >
            <ModePreview mode={mode} previewId={previewId} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
