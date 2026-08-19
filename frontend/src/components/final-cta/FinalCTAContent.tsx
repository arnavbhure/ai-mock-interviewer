import { motion, useReducedMotion } from "framer-motion";
import ParticleText from "@/components/ParticleText/ParticleText";
import { CTAButtons } from "@/components/final-cta/CTAButtons";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FinalCTAContent() {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col items-center text-center">
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
      </motion.div>

      {/* Particle text headline */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0 }}
        whileInView={reducedMotion ? undefined : { opacity: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.05, ease: EASE }}
        className="mt-5 w-full min-h-[clamp(9rem,24vw,14rem)]"
      >
        <ParticleText
          text="BE INTERVIEW READY"
          particleSize={1.8}
          density={4}
          color="#F5F7FA"
          highlightColor="#4D82FF"
          scatter={140}
          gatherDuration={1400}
          stagger={300}
          pointerRepel={28}
          repelRadius={110}
          idleDrift={0.35}
          trigger="hover"
          fontSize="clamp(3rem, 9vw, 7rem)"
          fontWeight={800}
          fontFamily="inherit"
          glow
          className="mx-auto max-w-[860px]"
        />
      </motion.div>

      <motion.p
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.08, ease: EASE }}
        className="mt-4 max-w-[34rem] text-base leading-7 text-text-secondary sm:text-lg sm:leading-8"
      >
        Practice smarter. Walk into your next interview prepared.
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
