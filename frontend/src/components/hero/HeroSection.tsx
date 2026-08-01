import { motion, useReducedMotion } from "framer-motion";
import { HeroContent } from "@/components/hero/HeroContent";
import { InterviewHeroDemo } from "@/components/hero/InterviewHeroDemo";
import { staggerContainer } from "@/components/hero/animations/variants";

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-background text-foreground"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-8rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(248,250,252,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,124,255,0.05),transparent_34%),linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[length:auto,100%_32px,32px_100%] opacity-60" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="flex flex-col justify-center">
            <HeroContent />
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
              className="w-full max-w-[720px]"
            >
              <InterviewHeroDemo />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
