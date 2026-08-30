import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mic, Sparkles, Send, AlertTriangle, Loader2 } from "lucide-react";
import type { OrbState, InterviewStatus, InterviewError } from "@/types/interview.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  orbState: OrbState;
  status: InterviewStatus;
  answer: string;
  setAnswer: (answer: string) => void;
  onSubmitAnswer: () => void;
  formattedAnswerTime?: string;
  error?: InterviewError | null;
  className?: string;
};

/**
 * Candidate Response Area
 *
 * Provides real-time text answering, audio visualizer, and submission control
 * bound directly to the Zustand real-time interview state.
 */
export function CandidateResponseArea({
  orbState,
  status,
  answer,
  setAnswer,
  onSubmitAnswer,
  formattedAnswerTime = "00:00",
  error,
  className,
}: Props) {
  const reduced = useReducedMotion();
  const normalizedState = orbState.toUpperCase();
  const isListening = normalizedState === "LISTENING";
  const isProcessing = status === "submitting" || normalizedState === "PROCESSING";
  const isStarting = status === "starting";
  const isError = status === "error";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (answer.trim() && !isProcessing) {
        onSubmitAnswer();
      }
    }
  };

  return (
    <div className={cn("mx-auto w-full max-w-2xl px-4 flex flex-col items-center gap-4", className)}>
      {/* ── Error Banner ── */}
      {isError && error && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-left text-xs text-red-300"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
          <div className="flex-1">
            <p className="font-semibold text-red-200">Error [{error.code}]</p>
            <p className="mt-0.5 text-red-300/90">{error.message}</p>
          </div>
        </motion.div>
      )}

      {/* ── Waiting / Starting State ── */}
      {isStarting && (
        <div className="flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
          <span>Connecting to AI interviewer...</span>
        </div>
      )}

      {/* ── Active / Listening Response Form ── */}
      {(status === "active" || isProcessing || isError) && (
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center gap-3"
        >
          {/* Status badge & Waveform */}
          <div className="flex items-center justify-between w-full px-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <Mic className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>{isListening ? "Your turn • Answer naturally" : "AI Speaking"}</span>
              {isListening && (
                <>
                  <span className="text-emerald-500">•</span>
                  <span className="font-mono text-emerald-200">{formattedAnswerTime}</span>
                </>
              )}
            </div>

            {/* Audio Waveform */}
            {isListening && (
              <div className="flex items-center gap-0.5">
                {[30, 65, 95, 50, 80, 40, 85, 60, 75, 45, 90].map((height, i) => (
                  <motion.span
                    key={i}
                    className="w-0.5 rounded-full bg-emerald-400/75"
                    animate={
                      reduced
                        ? undefined
                        : {
                            height: [`${height * 0.25}%`, `${height}%`, `${height * 0.3}%`],
                          }
                    }
                    transition={{
                      duration: 0.6 + (i % 3) * 0.15,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: i * 0.04,
                    }}
                    style={{ height: `${height * 0.25}px`, minHeight: "4px" }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Answer Textarea Container */}
          <div className="relative w-full rounded-2xl border border-white/10 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-xl transition-all focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/30">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              placeholder="Type your response here (or press Enter to submit)..."
              rows={3}
              className="w-full resize-none bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none disabled:opacity-50"
            />

            <div className="flex items-center justify-between border-t border-white/[0.06] px-3 pt-2">
              <span className="text-[11px] text-slate-500">
                Shift + Enter for new line • Enter to submit
              </span>

              <Button
                type="button"
                onClick={onSubmitAnswer}
                disabled={!answer.trim() || isProcessing}
                size="sm"
                className="h-8 gap-1.5 bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-40"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Answer</span>
                    <Send className="h-3 w-3" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Processing Evaluation Feedback ── */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -4 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
            <span>Evaluating answer & synthesizing next question...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
