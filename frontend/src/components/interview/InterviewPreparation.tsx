import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { useInterviewStore } from "@/store/interview.store";
import { AIOrb } from "@/components/interview/AIOrb";
import { Button } from "@/components/ui/button";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Labels for the animated preparation step indicator. */
const PREPARATION_STEPS = [
  "Analyzing your interview plan",
  "Building your first question",
  "Getting the interview ready",
] as const;

const STEP_DELAY_MS = 2400;

type Props = {
  onRetry: () => void;
  onBack: () => void;
};

/**
 * Shown after the user clicks "Start Interview" while waiting for the
 * backend to emit the first `interview:question`.
 */
export function InterviewPreparation({ onRetry, onBack }: Props) {
  const reduced = useReducedMotion();
  const status = useInterviewStore((s) => s.status);
  const error = useInterviewStore((s) => s.error);

  // ── Animated step progression ──
  const [stepIdx, setStepIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (error) return;
    if (stepIdx >= PREPARATION_STEPS.length - 1) return;

    timerRef.current = setTimeout(() => {
      setStepIdx((i) => Math.min(i + 1, PREPARATION_STEPS.length - 1));
    }, STEP_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stepIdx, error]);

  const handleRetry = () => {
    setStepIdx(0);
    onRetry();
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#060813] px-4 py-12 text-slate-100 select-none">
      {/* ── Ambient Background ── */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/8 blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        {/* ── AI Orb (thinking state) ── */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease }}
        >
          <AIOrb state="thinking" />
        </motion.div>

        {/* ── Title ── */}
        <motion.h1
          initial={reduced ? undefined : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.1 }}
          className="mt-6 text-xl font-bold tracking-tight text-white sm:text-2xl"
        >
          {error ? "Something went wrong" : "Preparing your interview…"}
        </motion.h1>

        {/* ── Step Indicator ── */}
        {!error && (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.2 }}
            className="mt-6 w-full space-y-3"
          >
            {PREPARATION_STEPS.map((label, i) => {
              const isActive = i === stepIdx;
              const isComplete = i < stepIdx;

              return (
                <motion.div
                  key={label}
                  initial={reduced ? undefined : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  {/* Step dot */}
                  <span
                    className={`inline-block h-2 w-2 shrink-0 rounded-full transition-colors duration-300 ${
                      isComplete
                        ? "bg-indigo-400"
                        : isActive
                          ? "bg-indigo-500 animate-pulse"
                          : "bg-slate-700"
                    }`}
                  />
                  <span
                    className={`text-sm transition-colors duration-300 ${
                      isActive
                        ? "text-slate-200 font-medium"
                        : isComplete
                          ? "text-slate-400"
                          : "text-slate-600"
                    }`}
                  >
                    {label}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ── Status subtitle ── */}
        {!error && (
          <motion.p
            initial={reduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-5 text-xs text-slate-500"
          >
            {status === "connecting"
              ? "Connecting to the interview server…"
              : status === "starting"
                ? "Starting your interview session…"
                : "Waiting for the AI interviewer…"}
          </motion.p>
        )}

        {/* ── Error State ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="mt-8 w-full rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-left"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  {error.code && (
                    <p className="text-[11px] font-mono text-red-400/70 mb-1">
                      {error.code}
                    </p>
                  )}
                  <p className="text-sm text-red-300 break-words [overflow-wrap:anywhere]">
                    {error.message || "An unexpected error occurred."}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3 border-t border-red-500/15 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="h-8 gap-1.5 text-xs font-medium border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to setup</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleRetry}
                  className="h-8 gap-1.5 bg-red-600 text-white hover:bg-red-500 text-xs font-medium"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Try Again</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
