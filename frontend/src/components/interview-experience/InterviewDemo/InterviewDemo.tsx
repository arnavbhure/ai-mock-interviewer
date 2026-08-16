import { motion, useReducedMotion } from "framer-motion";
import {
  demoContainer,
  demoRow,
} from "@/components/interview-experience/animations/variants";
import { InterviewHeader } from "@/components/interview-experience/InterviewDemo/InterviewHeader";
import { Question } from "@/components/interview-experience/InterviewDemo/Question";
import { CandidateResponse } from "@/components/interview-experience/InterviewDemo/CandidateResponse";
import { ListeningIndicator } from "@/components/interview-experience/InterviewDemo/ListeningIndicator";
import { FollowUpQuestion } from "@/components/interview-experience/InterviewDemo/FollowUpQuestion";
import { GridBackground } from "@/components/ui/GridBackground";

/**
 * A realistic (but static) interview interface that demonstrates how
 * InterviewAI looks during a live session.
 *
 * TODO: Wire this up with actual session data + real-time state when
 *       the interview API is connected.
 */
export function InterviewDemo() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "show"}
      viewport={{ once: true, margin: "-80px" }}
      variants={demoContainer}
      className="relative w-full overflow-hidden rounded-card border border-border bg-surface shadow-card"
    >
      <GridBackground />
      <div className="relative z-10">
        <InterviewHeader />
        <div className="divide-y divide-border">
          <motion.div variants={demoRow}>
            <Question />
          </motion.div>
          <motion.div variants={demoRow}>
            <CandidateResponse />
          </motion.div>
          <motion.div variants={demoRow}>
            <ListeningIndicator />
          </motion.div>
          <motion.div variants={demoRow}>
            <FollowUpQuestion />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
