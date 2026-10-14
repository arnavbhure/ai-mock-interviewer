import { useRef, useEffect, useMemo } from "react";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Keyboard,
  Send,
  Trash2,
  AlertTriangle,
  Loader2,
  Volume2,
} from "lucide-react";
import type { OrbState, InterviewStatus, InterviewError } from "@/types/interview.types";
import type { CandidateInputMode } from "@/types/speechRecognition.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  orbState: OrbState;
  status: InterviewStatus;
  mode: CandidateInputMode;
  onSelectMode: (mode: CandidateInputMode) => void;
  isListening: boolean;
  interimTranscript?: string;
  isSpeechSupported?: boolean;
  speechError?: string | null;
  answer: string;
  setAnswer: (answer: string | ((prev: string) => string)) => void;
  onClearAnswer: () => void;
  onSubmitAnswer: () => void;
  formattedAnswerTime?: string;
  error?: InterviewError | null;
  className?: string;
};

/**
 * Candidate Response Area
 *
 * Implements strict separation:
 * 1. Voice Mode:
 *    - Absolutely NO textarea.
 *    - Displays clean live transcript preview, audio visualizer, Clear, and Submit.
 * 2. Text Mode:
 *    - Absolutely NO microphone or audio cues.
 *    - Pure keyboard textarea with Clear and Submit.
 */
export function CandidateResponseArea({
  status,
  mode,
  onSelectMode,
  isListening,
  interimTranscript = "",
  isSpeechSupported = true,
  speechError = null,
  answer,
  setAnswer,
  onClearAnswer,
  onSubmitAnswer,
  error,
  className,
}: Props) {
  const safeAnswer = typeof answer === "string" ? answer : "";
  const hasAnswerText = Boolean(safeAnswer.trim());
  const isProcessing = status === "submitting";

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript container as new words arrive
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [safeAnswer, interimTranscript]);

  // Word count badge for user feedback
  const wordCount = useMemo(() => {
    const words = safeAnswer.trim().split(/\s+/).filter(Boolean);
    return words.length;
  }, [safeAnswer]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (hasAnswerText && !isProcessing) {
        onSubmitAnswer();
      }
    }
  };

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-2xl px-2 sm:px-4 flex flex-col items-center gap-1.5 sm:gap-2 select-none min-h-0",
        className,
      )}
    >
      {/* ── Mode Selector Tabs ── */}
      <div
        role="tablist"
        aria-label="Input Mode"
        className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-950/80 p-1 shadow-md backdrop-blur-xl"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "voice"}
          disabled={!isSpeechSupported || isProcessing}
          onClick={() => onSelectMode("voice")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all duration-200 cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
            mode === "voice"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]",
            !isSpeechSupported && "opacity-50 cursor-not-allowed",
          )}
        >
          <Mic className="size-3.5" aria-hidden="true" />
          <span>Voice Mode</span>
          {!isSpeechSupported && (
            <span className="text-[10px] text-slate-400 font-normal">
              (Unavailable)
            </span>
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "text"}
          disabled={isProcessing}
          onClick={() => onSelectMode("text")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all duration-200 cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
            mode === "text"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]",
          )}
        >
          <Keyboard className="size-3.5" aria-hidden="true" />
          <span>Text Mode</span>
        </button>
      </div>

      {/* ── Session / Speech Error Alert ── */}
      {(error || speechError) && (
        <div className="w-full flex items-start justify-between gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 backdrop-blur-md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
            <span>{speechError || error?.message || "An issue occurred."}</span>
          </div>
          {mode === "voice" && (
            <button
              type="button"
              onClick={() => onSelectMode("text")}
              className="text-[11px] font-semibold text-amber-300 underline hover:text-white shrink-0 ml-2 cursor-pointer"
            >
              Switch to Text Mode
            </button>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. VOICE MODE: NO TEXT BOX!
          Only voice status card / spoken transcript with clear & submit
          ───────────────────────────────────────────────────────────── */}
      {mode === "voice" ? (
        <div className="w-full">
          {hasAnswerText || interimTranscript ? (
            /* Spoken Transcript Live Display Card */
            <div className="w-full flex flex-col gap-2 rounded-2xl border border-emerald-500/40 bg-slate-950/90 p-3 sm:p-3.5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      isListening ? "bg-emerald-400 animate-pulse" : "bg-emerald-500",
                    )}
                  />
                  <span className="text-xs font-semibold text-slate-200">
                    {isListening ? "Listening & Transcribing..." : "Recorded Response"}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Live Word Count Badge */}
                  {wordCount > 0 && (
                    <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-400">
                      {wordCount} {wordCount === 1 ? "word" : "words"}
                    </span>
                  )}

                  {/* Audio Waveform while listening */}
                  {isListening && (
                    <div className="flex items-center gap-0.5" aria-hidden="true">
                      {[30, 75, 45, 90, 60, 80, 40].map((h, i) => (
                        <motion.span
                          key={i}
                          className="w-0.5 rounded-full bg-emerald-400"
                          animate={{
                            height: [`${h * 0.2}px`, `${h * 0.55}px`, `${h * 0.2}px`],
                          }}
                          transition={{
                            duration: 0.6 + i * 0.08,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{ height: `${h * 0.2}px` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Transcribed text body */}
              <div className="min-h-[68px] max-h-32 sm:max-h-40 overflow-y-auto px-3 py-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs sm:text-sm text-slate-100 font-normal leading-relaxed select-text scroll-smooth">
                <p>
                  &ldquo;{safeAnswer}&rdquo;
                  {interimTranscript && (
                    <span className="text-cyan-300 italic ml-1.5 animate-pulse">
                      {interimTranscript}...
                    </span>
                  )}
                </p>
                <div ref={transcriptEndRef} />
              </div>

              {/* Bottom Actions for Voice */}
              <div className="flex items-center justify-between border-t border-white/[0.08] pt-2 px-0.5">
                <button
                  type="button"
                  onClick={onClearAnswer}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Clear spoken answer"
                >
                  <Trash2 className="size-3.5" />
                  <span>Clear & re-record</span>
                </button>

                <Button
                  type="button"
                  id="submit-answer-btn-voice"
                  onClick={onSubmitAnswer}
                  disabled={!hasAnswerText || isProcessing}
                  size="sm"
                  className="h-8 gap-1.5 bg-emerald-600 px-3.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/30 cursor-pointer disabled:opacity-40"
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
          ) : (
            /* Voice Prompt Card (Before speaking) */
            <div className="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-3 sm:p-3.5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full transition-all duration-300",
                    isListening
                      ? "bg-emerald-500 text-slate-950 shadow-[0_0_16px_rgba(16,185,129,0.5)]"
                      : "bg-slate-800 text-emerald-400 border border-white/10",
                  )}
                >
                  <Mic className={cn("size-5", isListening && "animate-pulse")} />
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-200">
                    {isListening ? "Microphone Active" : "Voice Mode Ready"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isListening
                      ? "Speak clearly. Your words will appear here in real-time."
                      : "Click the green microphone below to answer."}
                  </span>
                </div>
              </div>

              {/* Animated waveform while microphone is actively listening */}
              {isListening ? (
                <div className="flex items-center gap-0.5" aria-hidden="true">
                  {[25, 60, 85, 45, 75, 35, 80, 50].map((h, i) => (
                    <motion.span
                      key={i}
                      className="w-0.5 rounded-full bg-emerald-400"
                      animate={{
                        height: [`${h * 0.25}px`, `${h * 0.7}px`, `${h * 0.25}px`],
                      }}
                      transition={{
                        duration: 0.5 + i * 0.08,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{ height: `${h * 0.25}px` }}
                    />
                  ))}
                </div>
              ) : (
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                  Ready to Speak
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
           2. TEXT MODE: NO MIC, NO AUDIO ELEMENTS!
           Clean focused keyboard input
           ───────────────────────────────────────────────────────────── */
        <div className="relative w-full rounded-2xl border border-white/10 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-xl transition-all focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/30">
          <textarea
            value={safeAnswer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder="Type your response here (Shift + Enter for new line, Enter to submit)..."
            rows={3}
            className="w-full resize-none bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none disabled:opacity-50"
          />

          {/* Bottom Actions Bar */}
          <div className="flex items-center justify-between border-t border-white/[0.06] px-3 pt-2">
            <span className="text-[11px] text-slate-500">
              Shift + Enter for new line • Enter to submit
            </span>

            <div className="flex items-center gap-2">
              {hasAnswerText && (
                <button
                  type="button"
                  onClick={onClearAnswer}
                  disabled={isProcessing}
                  className="text-[11px] text-slate-400 hover:text-red-400 transition-colors p-1 cursor-pointer"
                  title="Clear text"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}

              <Button
                type="button"
                onClick={onSubmitAnswer}
                disabled={!hasAnswerText || isProcessing}
                size="sm"
                className="h-8 gap-1.5 bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-40 cursor-pointer"
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
        </div>
      )}
    </div>
  );
}
