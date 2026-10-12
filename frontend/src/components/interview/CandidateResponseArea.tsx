import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Mic,
  MicOff,
  Keyboard,
  Sparkles,
  Send,
  AlertTriangle,
  Loader2,
  Volume2,
  Trash2,
  Info,
} from "lucide-react";
import type { OrbState, InterviewStatus, InterviewError } from "@/types/interview.types";
import type { CandidateInputMode } from "@/types/speechRecognition.types";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  orbState: OrbState;
  status: InterviewStatus;
  answer: string;
  setAnswer: (answer: string) => void;
  onSubmitAnswer: () => void;
  formattedAnswerTime?: string;
  error?: InterviewError | null;
  className?: string;
};

/**
 * Candidate Response Area
 *
 * Implements dual-mode response input:
 * 1. Voice Mode: Native Web Speech API speech-to-text with interim preview,
 *    duplicate-prevention accumulation, and editable transcript review.
 * 2. Text Mode: Direct keyboard input.
 *
 * Switching modes preserves answer state and cleans up recognition sessions.
 */
export function CandidateResponseArea({
  orbState,
  status,
  answer,
  setAnswer,
  onSubmitAnswer,
  formattedAnswerTime = "00:00",
  error,
  className,
}: Props) {
  const reduced = useReducedMotion();
  const normalizedState = orbState.toUpperCase();
  const isSpeaking = normalizedState === "AI_SPEAKING" || normalizedState === "SPEAKING";
  const isProcessing = status === "submitting" || normalizedState === "PROCESSING";
  const isStarting = status === "starting";
  const isError = status === "error";

  // ─── Input Mode State (Voice default if supported, else Text) ───
  const [mode, setMode] = useState<CandidateInputMode>(() => {
    if (typeof window === "undefined") return "text";
    const hasSupport = Boolean(
      window.SpeechRecognition || window.webkitSpeechRecognition,
    );
    return hasSupport ? "voice" : "text";
  });

  // ─── Speech Recognition Callback (Safe Accumulation) ───────────
  const handleFinalSpeechSegment = useCallback(
    (finalChunk: string) => {
      const cleanChunk = finalChunk.trim();
      if (!cleanChunk) return;

      setAnswer((prev) => {
        const prevTrimmed = prev.trim();
        if (!prevTrimmed) return cleanChunk;
        return `${prevTrimmed} ${cleanChunk}`;
      });
    },
    [setAnswer],
  );

  const speech = useSpeechRecognition({
    lang: "en-US",
    disabled: isProcessing || mode !== "voice",
    onFinalResult: handleFinalSpeechSegment,
  });

  // ─── Stop listening if interview advances or submits ───────────
  useEffect(() => {
    if (isProcessing || status === "completed" || isStarting) {
      if (speech.isListening) {
        speech.stopListening();
      }
    }
  }, [isProcessing, status, isStarting, speech]);

  // ─── Switch Modes Safely ───────────────────────────────────────
  const handleSelectMode = (newMode: CandidateInputMode) => {
    if (newMode === mode) return;

    if (newMode === "voice") {
      if (!speech.isSupported) {
        return; // Voice unsupported, stay in text
      }
      setMode("voice");
    } else {
      // Switching to text: stop active recognition session immediately
      if (speech.isListening) {
        speech.stopListening();
      }
      setMode("text");
    }
  };

  // ─── Voice Mic Toggle (Start / Stop Speaking) ───────────────────
  const handleToggleVoiceRecording = () => {
    if (isProcessing) return;

    if (speech.isListening) {
      speech.stopListening();
    } else {
      speech.startListening();
    }
  };

  // ─── Clear current answer ─────────────────────────────────────
  const handleClearAnswer = () => {
    if (isProcessing) return;
    if (speech.isListening) {
      speech.stopListening();
    }
    setAnswer("");
  };

  // ─── Submit Answer Handler ────────────────────────────────────
  const handleSubmit = () => {
    // 1. Immediately halt recognition session before submit
    if (speech.isListening) {
      speech.stopListening();
    }

    const trimmed = answer.trim();
    if (!trimmed || isProcessing) return;

    onSubmitAnswer();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-2xl px-4 flex flex-col items-center gap-3.5",
        className,
      )}
    >
      {/* ── Mode Selector Tabs ── */}
      <div
        role="tablist"
        aria-label="Input Mode"
        className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-950/80 p-1 shadow-lg backdrop-blur-xl"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "voice"}
          aria-pressed={mode === "voice"}
          disabled={!speech.isSupported || isProcessing}
          onClick={() => handleSelectMode("voice")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
            mode === "voice"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]",
            !speech.isSupported && "opacity-50 cursor-not-allowed",
          )}
        >
          <Mic className="size-3.5" aria-hidden="true" />
          <span>Voice Mode</span>
          {!speech.isSupported && (
            <span className="text-[10px] text-slate-400 font-normal">
              (Unavailable)
            </span>
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "text"}
          aria-pressed={mode === "text"}
          disabled={isProcessing}
          onClick={() => handleSelectMode("text")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
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

      {/* ── Global Session Error Banner ── */}
      {isError && error && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-left text-xs text-red-300"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
          <div className="flex-1">
            <p className="font-semibold text-red-200">Session Error [{error.code}]</p>
            <p className="mt-0.5 text-red-300/90">{error.message}</p>
          </div>
        </motion.div>
      )}

      {/* ── Voice Recognition Error Banner ── */}
      {mode === "voice" && speech.error && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-left text-xs text-amber-200"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="size-4 shrink-0 text-amber-400" />
            <p>{speech.error}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleSelectMode("text")}
            className="h-7 text-xs font-medium text-amber-300 hover:text-white hover:bg-amber-500/20 shrink-0"
          >
            Switch to Text
          </Button>
        </motion.div>
      )}

      {/* ── Connecting Indicator ── */}
      {isStarting && (
        <div className="flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
          <span>Connecting to AI interviewer...</span>
        </div>
      )}

      {/* ── Active Response Container ── */}
      {(status === "active" || isProcessing || isError) && (
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center gap-3"
        >
          {/* Status Header: Mode-Specific Turn Indicators & Timers */}
          <div className="flex items-center justify-between w-full px-1 text-xs">
            {mode === "voice" ? (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium border transition-colors",
                    speech.isListening
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-800 bg-slate-900/60 text-slate-400",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      speech.isListening
                        ? "bg-emerald-400 animate-ping"
                        : "bg-slate-600",
                    )}
                  />
                  <span>
                    {speech.isListening
                      ? "Listening to your answer..."
                      : answer.trim()
                        ? "Review transcript before submitting"
                        : "Click microphone to begin speaking"}
                  </span>
                </span>

                {speech.isListening && (
                  <span className="font-mono text-emerald-300/90 text-xs">
                    {formattedAnswerTime}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-slate-300 font-medium">
                  <Keyboard className="size-3 text-slate-400" />
                  <span>Text Mode • Type your response</span>
                </span>
                <span className="font-mono text-slate-400 text-xs">
                  {formattedAnswerTime}
                </span>
              </div>
            )}

            {/* Audio Waveform while listening */}
            {speech.isListening && mode === "voice" && (
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {[30, 65, 95, 50, 80, 40, 85, 60, 75, 45, 90].map((height, i) => (
                  <motion.span
                    key={i}
                    className="w-0.5 rounded-full bg-emerald-400/80"
                    animate={
                      reduced
                        ? undefined
                        : {
                            height: [
                              `${height * 0.25}%`,
                              `${height}%`,
                              `${height * 0.3}%`,
                            ],
                          }
                    }
                    transition={{
                      duration: 0.6 + (i % 3) * 0.15,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: i * 0.04,
                    }}
                    style={{ height: `${height * 0.25}px`, minHeight: "4px" }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Voice Mode Interactive Mic Banner ── */}
          {mode === "voice" && (
            <div className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 p-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleVoiceRecording}
                  disabled={isProcessing}
                  aria-label={
                    speech.isListening ? "Stop speaking" : "Start speaking"
                  }
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-full transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
                    speech.isListening
                      ? "bg-emerald-500 text-slate-950 shadow-[0_0_16px_rgba(16,185,129,0.4)]"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/10",
                  )}
                >
                  {speech.isListening ? (
                    <Mic className="size-5 animate-pulse" />
                  ) : (
                    <Mic className="size-5" />
                  )}
                </button>

                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-200">
                    {speech.isListening
                      ? "Microphone Active"
                      : answer.trim()
                        ? "Microphone Paused"
                        : "Start Speaking"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {speech.isListening
                      ? "Speak clearly. Click to pause or finish."
                      : answer.trim()
                        ? "Click mic to append more speech or edit below."
                        : "Click the mic when you are ready to answer."}
                  </span>
                </div>
              </div>

              {answer.trim() && (
                <button
                  type="button"
                  onClick={handleClearAnswer}
                  disabled={isProcessing}
                  title="Clear transcript"
                  aria-label="Clear answer"
                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 className="size-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          )}

          {/* ── Textarea & Live Interim Preview Box ── */}
          <div className="relative w-full rounded-2xl border border-white/10 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-xl transition-all focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/30">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              placeholder={
                mode === "voice"
                  ? speech.isListening
                    ? "Listening... Your speech will appear here as you talk..."
                    : "Your spoken transcript will appear here. You can also edit it directly..."
                  : "Type your response here (Shift + Enter for new line, Enter to submit)..."
              }
              rows={3}
              className="w-full resize-none bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none disabled:opacity-50"
            />

            {/* Interim Transcript Live Preview */}
            {mode === "voice" && speech.interimTranscript && (
              <div className="mx-3 mb-2 flex items-start gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06] px-2.5 py-1.5 text-xs text-cyan-200/90 animate-pulse">
                <Volume2 className="size-3.5 shrink-0 text-cyan-400 mt-0.5" />
                <span className="italic leading-relaxed">
                  {speech.interimTranscript}
                </span>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between border-t border-white/[0.06] px-3 pt-2">
              <span className="text-[11px] text-slate-500">
                {mode === "voice"
                  ? "Review & edit transcript before submitting"
                  : "Shift + Enter for new line • Enter to submit"}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!answer.trim() || isProcessing}
                  size="sm"
                  className="h-8 gap-1.5 bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-40"
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
        </motion.div>
      )}

      {/* ── Processing Evaluation Feedback ── */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -4 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
            <span>Evaluating answer & synthesizing next question...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
