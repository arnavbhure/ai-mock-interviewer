import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { OrbState } from "@/types/interview.types";
import { cn } from "@/lib/utils";

type Props = {
  question: string;
  topic?: string;
  questionNumber?: number | null;
  roundNumber?: number | null;
  difficulty?: string | null;
  orbState: OrbState;
  className?: string;
};

/**
 * Spoken Question Display Component
 *
 * Prominently renders the AI interviewer's question text below the orb.
 */
export function QuestionDisplay({
  question,
  topic,
  questionNumber,
  roundNumber,
  difficulty,
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
      {/* ── Context & Metadata Pill ── */}
      <motion.div
        key={`meta-${questionNumber}-${roundNumber}`}
        initial={reduced ? undefined : { opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-slate-400 backdrop-blur-md"
      >
        {questionNumber !== null && questionNumber !== undefined && (
          <span className="font-semibold text-indigo-400">
            Question {String(questionNumber).padStart(2, "0")}
          </span>
        )}
        {roundNumber !== null && roundNumber !== undefined && (
          <>
            <span className="text-slate-600">•</span>
            <span>Round {roundNumber}</span>
          </>
        )}
        {topic && (
          <>
            <span className="text-slate-600">•</span>
            <span>{topic}</span>
          </>
        )}
        {difficulty && (
          <>
            <span className="text-slate-600">•</span>
            <span className="capitalize text-indigo-300">{difficulty}</span>
          </>
        )}
      </motion.div>

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
              "text-base sm:text-lg md:text-xl font-medium leading-snug tracking-tight max-w-2xl transition-all duration-300",
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
