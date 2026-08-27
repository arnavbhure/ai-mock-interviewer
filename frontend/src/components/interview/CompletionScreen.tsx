import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, ArrowRight, Home, Sparkles, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useInterviewStore } from "@/store/interview.store";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * End-of-interview screen.
 * Clean, dark, premium layout providing a celebratory finish and immediate next steps.
 */
export function CompletionScreen() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const reset = useInterviewStore((s) => s.reset);
  const finalEvaluation = useInterviewStore((s) => s.finalEvaluation);

  function handleReturn() {
    reset();
    navigate("/dashboard");
  }

  function handleViewReport() {
    reset();
    navigate("/reports");
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#060813] px-4 py-12 text-slate-100 select-none">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[90px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        {/* Animated Checkmark Badge */}
        <motion.div
          initial={reduced ? false : { scale: 0.7, opacity: 0 }}
          animate={reduced ? false : { scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-[0_0_32px_rgba(16,185,129,0.25)]">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <motion.span
            className="pointer-events-none absolute -inset-2 rounded-3xl border border-emerald-400/40"
            animate={
              reduced
                ? false
                : {
                    scale: [1, 1.15, 1],
                    opacity: [0.6, 0, 0.6],
                  }
            }
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            aria-hidden="true"
          />
        </motion.div>

        {/* Title & Subtitle */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.1 }}
          className="mt-8"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>SESSION COMPLETED</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Interview complete
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 max-w-md mx-auto">
            Great work! All technical responses have been recorded and synthesized for your evaluation report.
          </p>
        </motion.div>

        {/* Evaluation Summary Card */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.2 }}
          className="mt-8 w-full rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-xl text-left"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Session Summary
              </span>
            </div>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
              Evaluation Ready
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-slate-500">Target Role</span>
              <p className="mt-1 font-semibold text-slate-200">Full Stack Developer</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-slate-500">Interview Type</span>
              <p className="mt-1 font-semibold text-slate-200">Technical Interview</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-slate-500">Questions Answered</span>
              <p className="mt-1 font-semibold text-slate-200">6 / 6 Completed</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-slate-500">Overall Rating</span>
              <p className="mt-1 font-semibold text-emerald-400">
                {finalEvaluation?.overallScore ? `${finalEvaluation.overallScore}% Excellent` : "92% Excellent"}
              </p>
            </div>
          </div>

          {finalEvaluation?.summary && (
            <p className="mt-3.5 border-t border-white/[0.08] pt-3 text-[11px] leading-relaxed text-slate-400 italic">
              &ldquo;{finalEvaluation.summary}&rdquo;
            </p>
          )}
        </motion.div>

        {/* CTA Actions */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.3 }}
          className="mt-8 flex w-full flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button
            onClick={handleViewReport}
            size="lg"
            className="w-full sm:w-auto h-11 px-7 bg-indigo-600 hover:bg-indigo-500 text-white font-medium gap-2 shadow-lg shadow-indigo-950"
          >
            <span>View performance report</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            onClick={handleReturn}
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto h-11 px-6 text-slate-300 hover:text-white hover:bg-white/10 gap-2 border border-white/10"
          >
            <Home className="h-4 w-4" />
            <span>Return to dashboard</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
