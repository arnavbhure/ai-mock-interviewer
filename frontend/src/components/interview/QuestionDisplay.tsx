import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { OrbState } from "@/types/interview.types";
import { cn } from "@/lib/utils";

type Props = {
  question: string;
  topic?: string;
  questionNumber?: number;
  totalQuestions?: number;
  orbState: OrbState;
  className?: string;
};

/**
 * Spoken Question Display Component
 *
 * Prominently renders the AI interviewer's speech text below the orb.
 * Ensures the candidate does not depend solely on audio cues.
 */
export function QuestionDisplay({
  question,
  topic,
  questionNumber,
  totalQuestions,
  orbState,
  className,
}: Props) {
  const reduced = useReducedMotion();
  const normalizedState = orbState.toUpperCase();
  const isSpeaking = normalizedState === "AI_SPEAKING" || normalizedState === "SPEAKING";

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center select-text",
        className,
      )}
    >
      {/* ── Topic / Category Pill ── */}
      {topic && (
        <motion.div
          key={`topic-${topic}`}
          initial={reduced ? undefined : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium tracking-wide text-slate-400 backdrop-blur-md"
        >
          {questionNumber && totalQuestions && (
            <span className="font-semibold text-indigo-400">
              Question {String(questionNumber).padStart(2, "0")}
            </span>
          )}
          {questionNumber && totalQuestions && <span className="text-slate-600">•</span>}
          <span>{topic}</span>
        </motion.div>
      )}

      {/* ── Main Spoken Question Text ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question}
          initial={reduced ? undefined : { opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduced ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <p
            className={cn(
              "text-lg sm:text-xl md:text-2xl font-normal leading-relaxed tracking-tight transition-all duration-300",
              isSpeaking
                ? "text-white drop-shadow-[0_2px_16px_rgba(255,255,255,0.15)]"
                : "text-slate-200/90",
            )}
          >
            &ldquo;{question}&rdquo;
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
