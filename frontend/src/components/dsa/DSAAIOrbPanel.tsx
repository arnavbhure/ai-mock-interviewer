import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mic, BrainCircuit, Volume2, Send, Sparkles } from "lucide-react";
import type { AIOrbVisualState, DSADialogueStep } from "@/types/dsaInterview.types";
import { AIOrb } from "@/components/interview";
import { Button } from "@/components/ui/button";

type Props = {
  visualState: AIOrbVisualState;
  dialogue: DSADialogueStep;
  isAiThinking: boolean;
  candidateResponse: string;
  onCandidateResponseChange: (val: string) => void;
  onSubmitCandidateResponse: (customText?: string) => void;
};

/**
 * Left-docked AI Interviewer Panel with restrained WebGL Orb & speech transcript.
 */
export function DSAAIOrbPanel({
  visualState,
  dialogue,
  isAiThinking,
  candidateResponse,
  onCandidateResponseChange,
  onSubmitCandidateResponse,
}: Props) {
  const reduced = useReducedMotion();

  const isSpeaking = visualState === "speaking";
  const isListening = visualState === "listening";
  const isThinking = visualState === "thinking" || isAiThinking;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && candidateResponse.trim() && !isAiThinking) {
      e.preventDefault();
      onSubmitCandidateResponse();
    }
  };

  return (
    <div className="flex flex-col items-center rounded-xl border border-white/[0.08] bg-slate-950/80 p-3.5 sm:p-4 shadow-xl select-none">
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between w-full mb-1.5">
        <div className="flex items-center gap-1.5 text-slate-400">
          <BrainCircuit className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            AI Interviewer
          </span>
        </div>

        {/* State Badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-slate-300">
          {isThinking ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping" />
              <span className="text-purple-300 font-semibold">Thinking</span>
            </>
          ) : isSpeaking ? (
            <>
              <Volume2 className="h-3 w-3 text-indigo-400 animate-pulse" />
              <span className="text-indigo-300 font-semibold">Speaking</span>
            </>
          ) : isListening ? (
            <>
              <Mic className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-semibold">Listening</span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              <span className="text-slate-400">Ready</span>
            </>
          )}
        </div>
      </div>

      {/* ── Restrained WebGL AI Orb ── */}
      <div className="relative my-0.5 flex items-center justify-center">
        <AIOrb
          state={visualState}
          size={120}
          forceHoverState={true}
          rotateOnHover={true}
        />
      </div>

      {/* ── Spoken AI Dialogue Card (Always Visible) ── */}
      <div className="mt-1.5 w-full rounded-lg border border-white/[0.06] bg-slate-900/90 p-3 shadow-inner">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {isAiThinking ? "Synthesizing Evaluation..." : dialogue.stateLabel}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={dialogue.aiText}
            initial={reduced ? undefined : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-normal leading-relaxed text-slate-200"
          >
            &ldquo;{isAiThinking ? "Analyzing your answer and algorithmic approach..." : dialogue.aiText}&rdquo;
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Candidate Verbal / Discussion Dock (Active when listening) ── */}
      <AnimatePresence>
        {dialogue.requiresCandidateResponse && (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={reduced ? undefined : { opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col gap-1.5 overflow-hidden"
          >
            {/* Suggested quick answers */}
            {dialogue.suggestedAnswers && dialogue.suggestedAnswers.length > 0 && (
              <div className="flex flex-col gap-1 pt-0.5">
                <span className="text-[10px] font-medium text-slate-500">
                  Click to respond or type below:
                </span>
                <div className="flex flex-col gap-1">
                  {dialogue.suggestedAnswers.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSubmitCandidateResponse(suggestion)}
                      disabled={isAiThinking}
                      className="text-left rounded-md border border-indigo-500/20 bg-indigo-500/[0.06] px-2 py-1 text-[11px] text-slate-300 hover:bg-indigo-500/15 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <span className="text-indigo-400 font-semibold mr-1">›</span>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input bar */}
            <div className="relative mt-1 flex items-center gap-1.5">
              <input
                type="text"
                value={candidateResponse}
                onChange={(e) => onCandidateResponseChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isAiThinking}
                placeholder={dialogue.candidatePromptPlaceholder ?? "Type your response..."}
                className="w-full rounded-md border border-white/10 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
              />

              <Button
                type="button"
                onClick={() => onSubmitCandidateResponse()}
                disabled={!candidateResponse.trim() || isAiThinking}
                size="sm"
                className="h-7.5 shrink-0 gap-1 bg-indigo-600 px-2.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-40"
              >
                {isAiThinking ? (
                  <Sparkles className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <span>Send</span>
                    <Send className="h-2.5 w-2.5" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
