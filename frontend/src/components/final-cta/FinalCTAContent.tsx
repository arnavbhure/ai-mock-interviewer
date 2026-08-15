import { motion, useReducedMotion } from "framer-motion";
import { CTAButtons } from "@/components/final-cta/CTAButtons";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FinalCTAContent() {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <div className="mx-auto flex w-full max-w-[840px] flex-col items-center text-center">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex flex-col items-center"
      >
        <div aria-hidden="true" className="mb-8 flex items-center gap-3">
          <span className="h-px w-12 bg-primary/80 sm:w-16" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="h-px w-12 bg-primary/40 sm:w-16" />
        </div>

        <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
          Ready When You Are
        </p>

        <h2 className="mt-5 max-w-[12ch] text-balance text-[clamp(3.2rem,7vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-text">
          READY FOR THE INTERVIEW THAT MATTERS?
        </h2>
      </motion.div>

      <motion.p
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.08, ease: EASE }}
        className="mt-7 max-w-[34rem] text-base leading-7 text-text-secondary sm:text-lg sm:leading-8"
      >
        Practice with realistic interviews. Get honest feedback. Improve with
        every attempt.
      </motion.p>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.16, ease: EASE }}
      >
        <CTAButtons />
      </motion.div>
    </div>
  );
}
