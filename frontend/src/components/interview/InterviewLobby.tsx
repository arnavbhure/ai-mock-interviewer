import { motion, useReducedMotion } from "framer-motion";
import { Play, Briefcase, Gauge } from "lucide-react";
import { useInterviewStore } from "@/store/interview.store";
import { AIOrb } from "@/components/interview/AIOrb";
import logoMark from "@/public/Logo.png";
import { Button } from "@/components/ui/button";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Props = {
  onStart: () => void;
};

/**
 * Pre-interview lobby screen.
 * Shown when /interview loads but the user has not yet clicked Start Interview.
 * Displays role, difficulty, AI orb, and a prominent Start Interview button.
 */
export function InterviewLobby({ onStart }: Props) {
  const reduced = useReducedMotion();
  const role = useInterviewStore((s) => s.role);
  const difficulty = useInterviewStore((s) => s.difficulty);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#060813] px-4 py-12 text-slate-100 select-none">
      {/* ── Ambient Background ── */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/8 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-1/4 bottom-1/4 h-[350px] w-[350px] rounded-full bg-cyan-600/5 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        {/* ── Brand ── */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="flex items-center gap-2.5 mb-10"
        >
          <img
            alt="InterviewAI"
            src={logoMark}
            className="h-7 w-auto object-contain brightness-110 drop-shadow-[0_0_12px_rgba(99,102,241,0.3)]"
          />
          <span className="text-sm font-semibold tracking-tight text-white">
            InterviewAI
          </span>
        </motion.div>

        {/* ── AI Orb ── */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease, delay: 0.05 }}
        >
          <AIOrb state="idle" size={340} />
        </motion.div>

        {/* ── Title ── */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.15 }}
          className="mt-6"
        >
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Your interview is ready
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 max-w-sm mx-auto">
            Take a breath and start when you&apos;re ready. Your responses will be evaluated after the interview is completed.
          </p>
        </motion.div>

        {/* ── Role & Difficulty Pills ── */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.25 }}
          className="mt-6 flex items-center gap-3"
        >
          {role && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300">
              <Briefcase className="h-3 w-3 text-indigo-400" />
              <span>{role}</span>
            </div>
          )}
          {difficulty && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium capitalize text-indigo-300">
              <Gauge className="h-3 w-3" />
              <span>{difficulty}</span>
            </div>
          )}
        </motion.div>

        {/* ── Start Interview Button ── */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.35 }}
          className="mt-10"
        >
          <Button
            onClick={onStart}
            size="lg"
            className="h-12 px-10 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold gap-2.5 shadow-lg shadow-indigo-950/50 text-sm transition-all duration-200 hover:shadow-indigo-900/60 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="h-4 w-4" />
            <span>Start Interview</span>
          </Button>
        </motion.div>

        {/* ── Subtle footer note ── */}
        <motion.p
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-6 text-[11px] text-slate-500"
        >
          AI-powered mock interview · Real-time evaluation
        </motion.p>
      </div>
    </div>
  );
}
