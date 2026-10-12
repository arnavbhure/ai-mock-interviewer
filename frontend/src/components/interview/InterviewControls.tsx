import { motion, useReducedMotion } from "framer-motion";
import { Mic, LogOut, Volume2, VolumeX, Loader2 } from "lucide-react";
import type { OrbState, InterviewStatus } from "@/types/interview.types";
import { cn } from "@/lib/utils";

type Props = {
  orbState: OrbState;
  status: InterviewStatus;
  hasAnswer?: boolean;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onToggleListening: () => void;
  onEndInterview: () => void;
};

/**
 * Bottom control dock for the real-time interview room.
 *
 * Primary: Tactile central microphone button with state-reactive glow.
 * Secondary: Audio mute toggle, end interview with confirmation.
 */
export function InterviewControls({
  orbState,
  status,
  hasAnswer = false,
  isMuted = false,
  onToggleMute,
  onToggleListening,
  onEndInterview,
}: Props) {
  const reduced = useReducedMotion();
  const normalizedState = orbState.toUpperCase();
  const isListening = normalizedState === "LISTENING";
  const isSpeaking = normalizedState === "AI_SPEAKING" || normalizedState === "SPEAKING";
  const isSubmitting = status === "submitting";

  return (
    <footer className="relative z-20 flex flex-col items-center gap-3 pb-6 pt-2 select-none">
      {/* ── Control Dock Container ── */}
      <div className="flex items-center gap-6 sm:gap-8 rounded-full border border-white/10 bg-slate-950/80 px-6 py-2.5 shadow-2xl backdrop-blur-xl">
        {/* Left Secondary: Audio Mute */}
        <button
          type="button"
          onClick={onToggleMute}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            isMuted
              ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
              : "border-white/10 bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/10",
          )}
          aria-label={isMuted ? "Unmute AI audio" : "Mute AI audio"}
          title={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {/* Center Primary: Microphone Control */}
        <div className="relative flex flex-col items-center">
          <motion.button
            type="button"
            onClick={onToggleListening}
            disabled={isSubmitting}
            whileTap={!reduced && !isSubmitting ? { scale: 0.94 } : undefined}
            className={cn(
              "relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
              isSubmitting
                ? "bg-slate-800 text-slate-400 border border-white/10 cursor-not-allowed"
                : isListening
                  ? "bg-emerald-500 text-slate-950 shadow-[0_0_24px_rgba(16,185,129,0.5)] border-2 border-emerald-300"
                  : isSpeaking
                    ? "bg-indigo-600/80 text-white border border-indigo-400/30 shadow-[0_0_16px_rgba(99,102,241,0.25)]"
                    : "bg-slate-800 text-slate-400 border border-white/10 hover:border-white/20",
            )}
            aria-label={
              isSubmitting
                ? "Submitting answer"
                : isSpeaking
                  ? "Skip AI speech and begin answer"
                  : "Microphone status"
            }
          >
            {isSubmitting ? (
              <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
            ) : (
              <Mic className="h-6 w-6" />
            )}

            {/* Listening glowing pulse ring */}
            {isListening && !isSubmitting && (
              <motion.span
                className="pointer-events-none absolute -inset-2 rounded-full border-2 border-emerald-400"
                animate={
                  reduced
                    ? false
                    : {
                        scale: [1, 1.25, 1],
                        opacity: [0.7, 0, 0.7],
                      }
                }
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                aria-hidden="true"
              />
            )}
          </motion.button>
        </div>

        {/* Right Secondary Action: End Session */}
        <button
          type="button"
          onClick={onEndInterview}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400 transition-all duration-200 hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          aria-label="End interview"
          title="End interview"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* ── Status Prompt ── */}
      <span className="text-[11px] font-medium tracking-wide text-slate-400">
        {isSubmitting
          ? "Evaluating answer..."
          : isListening
            ? hasAnswer
              ? "Type answer or click submit when finished"
              : "Listening • Type or speak naturally"
            : isSpeaking
              ? "AI is asking question"
              : "Waiting for AI..."}
      </span>
    </footer>
  );
}
