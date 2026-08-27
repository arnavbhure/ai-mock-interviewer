import { motion, useReducedMotion } from "framer-motion";
import { Clock, LogOut } from "lucide-react";
import logoMark from "@/public/Logo.png";

type Props = {
  roundTitle?: string;
  questionNumber: number;
  totalQuestions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  formattedTime: string;
  onEndInterview: () => void;
};

/**
 * Minimal, restrained top bar for the technical DSA interview workspace.
 */
export function DSAHeader({
  roundTitle = "Round 2 · DSA",
  questionNumber,
  totalQuestions,
  difficulty,
  formattedTime,
  onEndInterview,
}: Props) {
  const reduced = useReducedMotion();

  const difficultyBadge = {
    Easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    Medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    Hard: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  }[difficulty];

  const progressPercent = totalQuestions > 0 ? (questionNumber / totalQuestions) * 100 : 50;

  return (
    <header className="relative z-20 flex h-13 shrink-0 items-center justify-between border-b border-white/[0.08] bg-slate-950/90 px-4 sm:px-6 select-none">
      {/* ── Left: Brand & Round Metadata ── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img
            alt="InterviewAI"
            src={logoMark}
            className="h-5.5 w-auto object-contain brightness-105"
          />
          <span className="text-sm font-semibold tracking-tight text-white">
            InterviewAI
          </span>
        </div>

        <span className="hidden h-3.5 w-px bg-white/10 sm:block" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-300">
            {roundTitle}
          </span>
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${difficultyBadge}`}>
            {difficulty}
          </span>
        </div>
      </div>

      {/* ── Right: Live Status, Timer, Question Count, Exit ── */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live indicator badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider">LIVE</span>
        </div>

        {/* Elapsed Session Timer */}
        <div className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs font-mono font-medium text-slate-300">
          <Clock className="h-3 w-3 text-slate-400" aria-hidden="true" />
          <span>{formattedTime}</span>
        </div>

        {/* Question Counter */}
        <div className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-slate-300">
          <span className="text-white font-semibold">Q{questionNumber}</span>
          <span className="text-slate-500 font-sans"> of {totalQuestions}</span>
        </div>

        {/* End Round Action */}
        <button
          type="button"
          onClick={onEndInterview}
          className="flex h-7.5 items-center gap-1.5 rounded-md border border-red-500/20 bg-red-500/10 px-2.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          title="End Interview Session"
          aria-label="End Interview Session"
        >
          <LogOut className="h-3 w-3" />
          <span className="hidden md:inline">End Round</span>
        </button>
      </div>

      {/* ── Progress Underline ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.06]" aria-hidden="true">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400"
          initial={{ width: "50%" }}
          animate={{ width: `${progressPercent}%` }}
          transition={reduced ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </header>
  );
}
