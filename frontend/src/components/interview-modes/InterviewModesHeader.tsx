import { motion, useReducedMotion } from "framer-motion";

export function InterviewModesHeader() {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[650px]"
    >
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
        Interview Modes
      </p>
      <h2 className="mt-4 max-w-[11ch] text-[clamp(3rem,6vw,4.5rem)] font-semibold leading-[0.94] tracking-[-0.05em] text-text">
        ONE PLATFORM. DIFFERENT INTERVIEWS.
      </h2>
      <p className="mt-6 max-w-[40rem] text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
        Every interview demands a different kind of preparation. InterviewAI
        adapts the experience to the type of interview you want to practice.
      </p>
    </motion.div>
  );
}
