import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mic, Sparkles } from "lucide-react";
import type { OrbState } from "@/types/interview.types";
import { cn } from "@/lib/utils";

type Props = {
  orbState: OrbState;
  transcript?: string;
  formattedAnswerTime?: string;
  className?: string;
};

/**
 * Candidate Response & Speech Feedback Area
 *
 * Appears below the question to guide the candidate during their speaking turn,
 * providing live audio waveform feedback, transcription preview, and status hints.
 */
export function CandidateResponseArea({
  orbState,
  transcript,
  formattedAnswerTime = "00:00",
  className,
}: Props) {
  const reduced = useReducedMotion();
  const normalizedState = orbState.toUpperCase();
  const isListening = normalizedState === "LISTENING";
  const isProcessing = normalizedState === "PROCESSING";

  return (
    <div className={cn("mx-auto w-full max-w-xl px-4 text-center select-none", className)}>
      <AnimatePresence mode="wait">
        {/* ── LISTENING: Candidate Turn & Live Audio Waveform ── */}
        {isListening && (
          <motion.div
            key="listening-area"
            initial={reduced ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            {/* Guide message */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-300">
              <Mic className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>Your turn • Answer naturally</span>
              <span className="text-emerald-500">•</span>
              <span className="font-mono text-emerald-200">{formattedAnswerTime}</span>
            </div>

            {/* Simulated Audio Waveform Bar Visualizer */}
            <div className="flex items-center justify-center gap-1 py-1">
              {[40, 75, 100, 60, 85, 45, 90, 65, 80, 50, 95, 70, 40].map((height, i) => (
                <motion.span
                  key={i}
                  className="w-1 rounded-full bg-emerald-400/80"
                  animate={
                    reduced
                      ? undefined
                      : {
                          height: [`${height * 0.25}%`, `${height}%`, `${height * 0.3}%`],
                        }
                  }
                  transition={{
                    duration: 0.6 + (i % 4) * 0.15,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: i * 0.05,
                  }}
                  style={{ height: `${height * 0.4}px`, minHeight: "6px" }}
                />
              ))}
            </div>

            {/* Candidate live transcript simulation preview */}
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900/60 p-3.5 text-left text-xs leading-relaxed text-slate-300 shadow-inner backdrop-blur-md"
              >
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Live Response Preview
                </div>
                <p className="italic text-slate-300">
                  &ldquo;{transcript}&rdquo;
                  <span className="inline-block h-3 w-1.5 translate-y-0.5 bg-emerald-400 animate-pulse ml-1" />
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── PROCESSING: Answer Evaluation & Transition ── */}
        {isProcessing && (
          <motion.div
            key="processing-area"
            initial={reduced ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
              <span>Analyzing answer & preparing next step...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
