import { motion, useReducedMotion } from "framer-motion";
import { introContainer, introItem } from "@/components/interview-experience/animations/variants";

export function InterviewExperienceIntro() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "show"}
      viewport={{ once: true, margin: "-80px" }}
      variants={introContainer}
      className="max-w-[560px]"
    >
      <motion.p
        variants={introItem}
        className="text-xs font-medium uppercase tracking-[0.28em] text-primary"
      >
        The Interview
      </motion.p>

      <motion.h2
        variants={introItem}
        className="mt-4 text-balance text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-text"
      >
        THE INTERVIEW
        <br />
        STARTS HERE.
      </motion.h2>

      <motion.p
        variants={introItem}
        className="mt-5 max-w-md text-base leading-7 text-text-secondary sm:text-lg"
      >
        Practice in a realistic interview environment where InterviewAI listens
        to your answer, understands what you say, and responds with relevant
        follow-up questions.
      </motion.p>
    </motion.div>
  );
}