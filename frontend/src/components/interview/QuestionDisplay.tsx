import { motion, AnimatePresence } from "framer-motion";
import type { OrbState } from "@/types/interview.types";
import { cn } from "@/lib/utils";

type Props = {
  question: string;
  orbState: OrbState;
  className?: string;
};

/**
 * Displays the current AI question below the orb.
 * Visually clear but subordinate to the orb — fades between questions
 * and dims slightly when the AI is no longer actively asking.
 */
export function QuestionDisplay({ question, orbState, className }: Props) {
  const isAsking = orbState === "AI_SPEAKING";

  return (
    <div
      className={cn(
        "w-full max-w-lg px-4 text-center",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={question}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: isAsking ? 1 : 0.65, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-base leading-relaxed text-text sm:text-lg sm:leading-relaxed"
        >
          "{question}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
