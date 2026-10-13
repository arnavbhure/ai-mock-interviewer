import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Volume2, Play, Square } from "lucide-react";
import type { OrbState } from "@/types/interview.types";
import { cn } from "@/lib/utils";

type Props = {
  question: string;
  topic?: string;
  questionNumber?: number | null;
  roundNumber?: number | null;
  difficulty?: string | null;
  orbState: OrbState;
  isAudioStreaming?: boolean;
  canReplayAudio?: boolean;
  isReplayingAudio?: boolean;
  onReplayAudio?: () => void;
  onStopReplayAudio?: () => void;
  className?: string;
};

/**
 * Spoken Question Display Component
 *
 * Prominently renders the AI interviewer's question text below the orb,
 * alongside real-time audio playback status and a replay button when audio streaming completes.
 */
export function QuestionDisplay({
  question,
  topic,
  questionNumber,
  roundNumber,
  difficulty,
  orbState,
  isAudioStreaming = false,
  canReplayAudio = false,
  isReplayingAudio = false,
  onReplayAudio,
  onStopReplayAudio,
  className,
}: Props) {
  const reduced = useReducedMotion();
  const normalizedState = orbState.toUpperCase();
  const isSpeaking = normalizedState === "AI_SPEAKING" || normalizedState === "SPEAKING";

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center select-text shrink-0",
        className,
      )}
    >
      {/* ── Context & Metadata Pill ── */}
      <motion.div
        key={`meta-${questionNumber}-${roundNumber}`}
        initial={reduced ? undefined : { opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-slate-400 backdrop-blur-md"
      >
        {questionNumber !== null && questionNumber !== undefined && (
          <span className="font-semibold text-indigo-400">
            Question {String(questionNumber).padStart(2, "0")}
          </span>
        )}
        {roundNumber !== null && roundNumber !== undefined && (
          <>
            <span className="text-slate-600">•</span>
            <span>Round {roundNumber}</span>
          </>
        )}
        {topic && (
          <>
            <span className="text-slate-600">•</span>
            <span>{topic}</span>
          </>
        )}
        {difficulty && (
          <>
            <span className="text-slate-600">•</span>
            <span className="capitalize text-indigo-300">{difficulty}</span>
          </>
        )}
      </motion.div>

      {/* ── Main Spoken Question Text ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question}
          initial={reduced ? undefined : { opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduced ? undefined : { opacity: 0, y: -6, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-2xl px-2"
        >
          <p
            className={cn(
              "text-sm sm:text-base md:text-lg font-medium leading-snug tracking-tight transition-all duration-300",
              isSpeaking
                ? "text-white drop-shadow-[0_2px_16px_rgba(255,255,255,0.15)]"
                : "text-slate-200/95",
            )}
          >
            &ldquo;{question}&rdquo;
          </p>
        </motion.div>
      </AnimatePresence>

      {/* ── Audio Playback Status / Replay Controls ── */}
      <div className="mt-1.5 flex items-center justify-center min-h-[28px]">
        {isAudioStreaming ? (
          /* Live TTS Streaming Status Indicator */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-0.5 text-xs text-indigo-300 backdrop-blur-md shadow-sm"
          >
            <Volume2 className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span className="font-medium text-[11px]">AI Interviewer speaking...</span>
            <div className="flex items-center gap-0.5 ml-1" aria-hidden="true">
              {[35, 75, 45, 90, 60].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-0.5 rounded-full bg-indigo-400"
                  animate={{
                    height: [`${h * 0.12}px`, `${h * 0.3}px`, `${h * 0.12}px`],
                  }}
                  transition={{
                    duration: 0.5 + i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ height: `${h * 0.12}px` }}
                />
              ))}
            </div>
          </motion.div>
        ) : (canReplayAudio || onReplayAudio) ? (
          /* Replay Question Audio Button (Available once stream has completed) */
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="inline-flex items-center"
          >
            <button
              type="button"
              onClick={isReplayingAudio ? onStopReplayAudio : onReplayAudio}
              className={cn(
                "group inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 cursor-pointer shadow-md select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                isReplayingAudio
                  ? "border border-cyan-400/50 bg-cyan-500/20 text-cyan-200 shadow-cyan-500/20 ring-1 ring-cyan-400/40"
                  : "border border-indigo-500/30 bg-slate-950/80 text-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-400 shadow-indigo-600/20",
              )}
              title={isReplayingAudio ? "Click to stop audio" : "Listen to the question again"}
            >
              {isReplayingAudio ? (
                <>
                  <Square className="h-3 w-3 fill-current text-cyan-300" />
                  <span className="text-[11px]">Stop Audio</span>
                  <div className="flex items-center gap-0.5 ml-0.5" aria-hidden="true">
                    {[40, 80, 50, 95].map((h, i) => (
                      <motion.span
                        key={i}
                        className="w-0.5 rounded-full bg-cyan-300"
                        animate={{
                          height: [`${h * 0.12}px`, `${h * 0.28}px`, `${h * 0.12}px`],
                        }}
                        transition={{
                          duration: 0.4 + i * 0.1,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{ height: `${h * 0.12}px` }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 fill-current text-indigo-400 group-hover:text-white transition-colors" />
                  <span className="text-[11px]">Play Audio Again</span>
                </>
              )}
            </button>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

export default QuestionDisplay;
