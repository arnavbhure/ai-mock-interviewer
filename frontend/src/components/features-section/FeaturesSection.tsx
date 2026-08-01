import { motion, useReducedMotion } from "framer-motion";
import { FeaturesGrid } from "@/components/features-section/FeaturesGrid";
import { sectionReveal } from "@/components/features-section/animations/variants";

export function FeaturesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="features" className="relative overflow-hidden bg-background py-20 text-foreground sm:py-24 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-border" />
        <div className="absolute left-1/2 top-14 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
      </div>

      <motion.div
        variants={sectionReveal}
        initial={reduceMotion ? false : "hidden"}
        whileInView={reduceMotion ? undefined : "visible"}
        viewport={{ once: true, margin: "-120px" }}
        className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">Why InterviewAI</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
            Everything you need to ace your next technical interview.
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            From resume parsing to adaptive questioning and hiring-grade reports, the platform feels like a real
            interview loop, not a chat demo.
          </p>
        </div>

        <div className="mt-10">
          <FeaturesGrid />
        </div>
      </motion.div>
    </section>
  );
}
