import { motion, useReducedMotion } from "framer-motion";
import { Mic, MicOff, LogOut, Volume2, VolumeX, Loader2 } from "lucide-react";
import type { OrbState, InterviewStatus } from "@/types/interview.types";
import type { CandidateInputMode } from "@/types/speechRecognition.types";
import { cn } from "@/lib/utils";

type Props = {
  orbState: OrbState;
  status: InterviewStatus;
  mode: CandidateInputMode;
  isListening?: boolean;
  hasAnswer?: boolean;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onToggleListening: () => void;
  onEndInterview: () => void;
};

/**
 * Bottom control dock for the real-time interview room.
 *
 * In Voice Mode:
 * - Tactile central green microphone button toggles live recording.
 * - Glowing aura and pulse rings when microphone is active.
 * - Secondary controls for AI speech audio mute and ending the interview session.
 *
 * In Text Mode:
 * - Microphone and audio-related controls are completely removed.
 * - Clean minimal dock with AI speaker mute and end interview.
 */
export function InterviewControls({
  orbState,
  status,
  mode,
  isListening = false,
  hasAnswer = false,
  isMuted = false,
  onToggleMute,
  onToggleListening,
  onEndInterview,
}: Props) {
  const reduced = useReducedMotion();
  const normalizedState = orbState.toUpperCase();
  const isSpeaking = normalizedState === "AI_SPEAKING" || normalizedState === "SPEAKING";
  const isSubmitting = status === "submitting";

  // ─── Text Mode: Completely remove the microphone and audio cues ───
  if (mode === "text") {
    return (
      <footer className="relative z-20 flex flex-col items-center gap-1.5 pb-2 pt-1 select-none shrink-0">
        <div className="flex items-center gap-4 rounded-full border border-white/10 bg-slate-950/80 px-4 py-1.5 shadow-2xl backdrop-blur-xl">
          {/* AI Speaker Audio Mute */}
          <button
            type="button"
            onClick={onToggleMute}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              isMuted
                ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                : "border-white/10 bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/10",
            )}
            aria-label={isMuted ? "Unmute AI audio" : "Mute AI audio"}
            title={isMuted ? "Unmute AI speech" : "Mute AI speech"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <span className="text-[11px] font-medium text-slate-400 px-1">
            Text Mode Active
          </span>

          {/* End Interview */}
          <button
            type="button"
            onClick={onEndInterview}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400 transition-all duration-200 hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label="End interview"
            title="End interview"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <span className="text-[11px] font-medium tracking-wide text-slate-500">
          Type your response in the box above and click Submit Answer
        </span>
      </footer>
    );
  }

  // ─── Voice Mode: Full functional microphone controls ───
  return (
    <footer className="relative z-20 flex flex-col items-center gap-2 pb-2.5 pt-1 select-none shrink-0">
      {/* ── Control Dock Container ── */}
      <div className="flex items-center gap-5 sm:gap-7 rounded-full border border-white/10 bg-slate-950/80 px-5 py-2 shadow-2xl backdrop-blur-xl">
        {/* Left Secondary: Audio Mute */}
        <button
          type="button"
          onClick={onToggleMute}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            isMuted
              ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
              : "border-white/10 bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/10",
          )}
          aria-label={isMuted ? "Unmute AI audio" : "Mute AI audio"}
          title={isMuted ? "Unmute AI speech" : "Mute AI speech"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {/* Center Primary: Functional Green Microphone */}
        <div className="relative flex flex-col items-center">
          <motion.button
            type="button"
            onClick={onToggleListening}
            disabled={isSubmitting}
            whileTap={!reduced && !isSubmitting ? { scale: 0.93 } : undefined}
            className={cn(
              "relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-all duration-300 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
              isSubmitting
                ? "bg-slate-800 text-slate-400 border border-white/10 cursor-not-allowed opacity-50"
                : isListening
                  ? "bg-emerald-500 text-slate-950 shadow-[0_0_24px_rgba(16,185,129,0.6)] border-2 border-emerald-300 ring-2 ring-emerald-400/40"
                  : "bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.25)]",
            )}
            aria-label={
              isSubmitting
                ? "Submitting answer"
                : isListening
                  ? "Stop microphone recording"
                  : "Start microphone recording"
            }
            title={
              isSubmitting
                ? "Submitting answer..."
                : isListening
                  ? "Click to stop recording"
                  : "Click to start speaking"
            }
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
            ) : isListening ? (
              <Mic className="h-6 w-6 animate-pulse" />
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
                  duration: 1.5,
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
          className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400 transition-all duration-200 hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
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
            ? "Microphone active • Speak clearly into your mic..."
            : hasAnswer
              ? "Voice response recorded • Click Submit Answer or click mic to add more"
              : isSpeaking
                ? "AI interviewer is speaking... (Click green mic to start answering)"
                : "Click the green microphone to speak your answer"}
      </span>
    </footer>
  );
}
