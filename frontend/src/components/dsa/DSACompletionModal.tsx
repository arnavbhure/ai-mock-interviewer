import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, ArrowRight, Home, Award, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { DSASubmissionSummary } from "@/types/dsaInterview.types";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  summary: DSASubmissionSummary | null;
  problemTitle: string;
};

/**
 * Completion / Solution Accepted Modal
 */
export function DSACompletionModal({ isOpen, onClose, summary, problemTitle }: Props) {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  if (!summary) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl backdrop-blur-xl text-slate-100"
          >
            {/* Success Header */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.25)]">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>ALL TESTS PASSED</span>
              </div>

              <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                Solution Accepted!
              </h2>
              <p className="mt-1 text-xs text-slate-400 max-w-sm">
                Problem: <span className="font-semibold text-slate-200">{problemTitle}</span>
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/60 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Award className="h-4 w-4 text-indigo-400" />
                  <span>Evaluation Metrics</span>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 font-mono">
                  {summary.passedTests}/{summary.totalTests} Hidden Tests
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <span className="text-slate-500">Runtime</span>
                  <p className="font-mono font-semibold text-emerald-400">{summary.runtime}</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <span className="text-slate-500">Memory</span>
                  <p className="font-mono font-semibold text-slate-200">{summary.memory}</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <span className="text-slate-500">Time Complexity</span>
                  <p className="font-semibold text-slate-200">{summary.complexityTime}</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <span className="text-slate-500">Space Complexity</span>
                  <p className="font-semibold text-slate-200">{summary.complexitySpace}</p>
                </div>
              </div>

              <p className="pt-1 text-xs italic text-slate-400 leading-relaxed border-t border-white/[0.06]">
                &ldquo;{summary.feedback}&rdquo;
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto h-10 px-5 text-xs text-slate-300 hover:text-white hover:bg-white/10 gap-1.5"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>

              <Button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto h-10 px-6 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-950 gap-1.5"
              >
                <span>Continue Review</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
