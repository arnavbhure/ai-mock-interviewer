import { motion, useReducedMotion } from "framer-motion";
import { Clock } from "lucide-react";
import logoMark from "@/public/Logo.png";

type Props = {
  interviewType: string;
  role?: string;
  difficulty?: string | null;
  roundNumber?: number | null;
  questionNumber?: number | null;
  status?: string;
  formattedTime?: string;
};

/**
 * Minimal, dark top bar for the real-time interview room.
 * Displays InterviewAI branding, role context, question progress, and live session timer.
 */
export function InterviewHeader({
  interviewType,
  role = "Full Stack Developer",
  difficulty = "Medium",
  roundNumber,
  questionNumber,
  status = "active",
  formattedTime = "00:00",
}: Props) {
  const reduced = useReducedMotion();

  const isLive = status === "active" || status === "submitting";

  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] bg-slate-950/70 px-4 sm:px-6 md:px-8 backdrop-blur-xl select-none">
      {/* ── Left: Brand Mark & Title ── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <img
            alt="InterviewAI"
            src={logoMark}
            className="h-7 w-auto object-contain brightness-110 drop-shadow-[0_0_12px_rgba(99,102,241,0.3)]"
          />
          <span className="text-sm font-semibold tracking-tight text-white">
            InterviewAI
          </span>
        </div>

        <span className="hidden h-3.5 w-px bg-white/10 md:block" aria-hidden="true" />

        <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-slate-400 md:inline-flex">
          AI Interview Room
        </span>
      </div>

      {/* ── Center: Role & Session Context ── */}
      <div className="hidden items-center gap-2 lg:flex">
        <span className="text-xs font-semibold text-slate-200">
          {role}
        </span>
        <span className="h-3 w-px bg-white/10" aria-hidden="true" />
        <span className="text-[11px] font-medium text-slate-400">
          {interviewType}
        </span>
        {difficulty && (
          <>
            <span className="h-3 w-px bg-white/10" aria-hidden="true" />
            <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium capitalize text-indigo-300">
              {difficulty}
            </span>
          </>
        )}
      </div>

      {/* ── Right: Live indicator, Timer, Question Counter ── */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live status badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
          <span className="relative flex h-2 w-2">
            {isLive && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="uppercase">{status === "submitting" ? "PROCESSING" : "LIVE"}</span>
        </div>

        {/* Elapsed Timer */}
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-mono font-medium text-slate-300">
          <Clock className="h-3 w-3 text-slate-400" aria-hidden="true" />
          <span>{formattedTime}</span>
        </div>

        {/* Question & Round Counter */}
        {questionNumber !== null && questionNumber !== undefined && (
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
            <span className="text-white font-semibold">Q{questionNumber}</span>
            {roundNumber && <span className="text-slate-500"> • R{roundNumber}</span>}
          </div>
        )}
      </div>

      {/* ── Bottom Edge Subtle Progress Bar ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.06]"
        aria-hidden="true"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400"
          initial={{ width: "20%" }}
          animate={{
            width: questionNumber ? `${Math.min(questionNumber * 20, 100)}%` : "20%",
          }}
          transition={reduced ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </header>
  );
}
