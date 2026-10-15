import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Mic,
  BrainCircuit,
  Volume2,
  Send,
  Sparkles,
  ChevronRight,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  CircleDot,
} from "lucide-react";
import type { AIOrbVisualState, DSADialogueStep, DSAInterviewStage } from "@/types/dsaInterview.types";
import { AIOrb } from "@/components/interview";
import { Button } from "@/components/ui/button";

type Props = {
  visualState: AIOrbVisualState;
  dialogue: DSADialogueStep;
  isAiThinking: boolean;
  candidateResponse: string;
  onCandidateResponseChange: (val: string) => void;
  onSubmitCandidateResponse: (customText?: string) => void;
  stage?: DSAInterviewStage;
  onToggleCollapse?: () => void;
};

const STAGES: { id: DSAInterviewStage; label: string; short: string }[] = [
  { id: "INTRO", label: "Introduction", short: "Intro" },
  { id: "APPROACH_DISCUSSION", label: "Approach Discussion", short: "Approach" },
  { id: "CODING", label: "Live Coding", short: "Coding" },
  { id: "TEST_RESULTS", label: "Test Cases", short: "Tests" },
  { id: "POST_SUBMISSION_DISCUSSION", label: "Complexity Review", short: "Review" },
];

/**
 * Dedicated Right-docked AI Interviewer Panel.
 * Contains WebGL Orb, Speech Transcript, Stage Progress Stepper & Interactive Discussion Dock.
 */
export function DSAAIOrbPanel({
  visualState,
  dialogue,
  isAiThinking,
  candidateResponse,
  onCandidateResponseChange,
  onSubmitCandidateResponse,
  stage = "INTRO",
  onToggleCollapse,
}: Props) {
  const reduced = useReducedMotion();
  const [activeTab, setActiveTab] = useState<"dialogue" | "notes">("dialogue");

  const isSpeaking = visualState === "speaking";
  const isListening = visualState === "listening";
  const isThinking = visualState === "thinking" || isAiThinking;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && candidateResponse.trim() && !isAiThinking) {
      e.preventDefault();
      onSubmitCandidateResponse();
    }
  };

  const getStageIndex = (s: DSAInterviewStage) => {
    if (s === "INTRO") return 0;
    if (s === "APPROACH_DISCUSSION" || s === "APPROACH_EVALUATION") return 1;
    if (s === "CODING" || s === "RUNNING_CODE") return 2;
    if (s === "TEST_RESULTS" || s === "SUBMITTING") return 3;
    if (s === "POST_SUBMISSION_DISCUSSION" || s === "COMPLETED") return 4;
    return 2;
  };

  const currentStageIdx = getStageIndex(stage);

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-white/[0.08] bg-slate-950/90 p-3 sm:p-3.5 shadow-2xl select-none scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between w-full pb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-1.5 text-slate-300">
          <BrainCircuit className="h-4 w-4 text-indigo-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-white">
            AI Interviewer
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* State Badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium text-slate-300 shadow-sm">
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
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300">Active</span>
              </>
            )}
          </div>

          {/* Optional Collapse Toggle */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="rounded p-1 text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Collapse AI panel"
              aria-label="Collapse AI panel"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Interview Stage Progress Stepper ── */}
      <div className="mt-2.5 w-full rounded-lg bg-slate-900/60 p-2 border border-white/[0.04]">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mb-1 px-0.5">
          <span>Interview Stage</span>
          <span className="text-indigo-400 font-semibold">Step {currentStageIdx + 1} of 5</span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {STAGES.map((s, idx) => {
            const isCompleted = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            return (
              <div
                key={s.id}
                className="flex flex-col items-center gap-0.5"
                title={s.label}
              >
                <div
                  className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-500 shadow-xs shadow-emerald-500/50"
                      : isCurrent
                        ? "bg-indigo-500 shadow-xs shadow-indigo-500/50 animate-pulse"
                        : "bg-white/10"
                  }`}
                />
                <span
                  className={`text-[9px] truncate transition-colors ${
                    isCurrent
                      ? "text-indigo-300 font-semibold"
                      : isCompleted
                        ? "text-slate-400"
                        : "text-slate-600"
                  }`}
                >
                  {s.short}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Restrained WebGL AI Orb ── */}
      <div className="relative my-2 flex items-center justify-center shrink-0">
        <AIOrb
          state={visualState}
          size={110}
          forceHoverState={true}
          rotateOnHover={true}
        />
      </div>

      {/* ── Spoken AI Dialogue Card (Always Visible & Prominent) ── */}
      <div className="w-full flex-1 min-h-[100px] flex flex-col justify-between rounded-xl border border-indigo-500/20 bg-slate-900/90 p-3 shadow-inner">
        <div>
          <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
              <MessageSquare className="h-3 w-3" />
              <span>{isAiThinking ? "Synthesizing Evaluation..." : dialogue.stateLabel}</span>
            </div>

            {isSpeaking && (
              <span className="text-[10px] text-cyan-400 font-mono animate-pulse">
                Audio Live
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={dialogue.aiText}
              initial={reduced ? undefined : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-[13px] font-normal leading-relaxed text-slate-100 select-text font-sans"
            >
              &ldquo;{isAiThinking ? "Analyzing your answer and algorithmic approach..." : dialogue.aiText}&rdquo;
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Status prompt */}
        <div className="mt-2 text-[10px] text-slate-500 pt-1 border-t border-white/[0.04]">
          {isThinking
            ? "AI interviewer is processing your submission..."
            : isSpeaking
              ? "Interviewer is speaking. Listen carefully."
              : "Interviewer is evaluating your code & approach."}
        </div>
      </div>

      {/* ── Candidate Verbal / Discussion Dock ── */}
      <div className="mt-2.5 w-full flex flex-col gap-2 shrink-0">
        {dialogue.requiresCandidateResponse ? (
          /* When response is required (Approach Discussion, etc.) */
          <div className="w-full flex flex-col gap-1.5">
            {/* Suggested quick answers */}
            {dialogue.suggestedAnswers && dialogue.suggestedAnswers.length > 0 && (
              <div className="flex flex-col gap-1 pt-0.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Responses:
                </span>
                <div className="flex flex-col gap-1">
                  {dialogue.suggestedAnswers.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSubmitCandidateResponse(suggestion)}
                      disabled={isAiThinking}
                      className="text-left rounded-lg border border-indigo-500/30 bg-indigo-500/[0.08] px-2.5 py-1.5 text-xs text-slate-200 hover:bg-indigo-500/20 hover:text-white hover:border-indigo-500/50 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      <span className="text-indigo-400 font-bold mr-1">›</span>
                      <span>{suggestion}</span>
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
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none disabled:opacity-50 shadow-inner"
              />

              <Button
                type="button"
                onClick={() => onSubmitCandidateResponse()}
                disabled={!candidateResponse.trim() || isAiThinking}
                size="sm"
                className="h-8 shrink-0 gap-1 bg-indigo-600 px-3 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 cursor-pointer shadow-md shadow-indigo-900/30"
              >
                {isAiThinking ? (
                  <Sparkles className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <span>Send</span>
                    <Send className="h-3 w-3" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* When candidate is coding (Optional Inquiry Support) */
          <div className="rounded-xl border border-white/[0.06] bg-slate-900/60 p-2.5">
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              <HelpCircle className="h-3 w-3 text-indigo-400" />
              <span>Ask Interviewer for Clarification</span>
            </span>

            <div className="grid grid-cols-2 gap-1.5 mb-2">
              <button
                type="button"
                onClick={() =>
                  onSubmitCandidateResponse("Can you give me a hint on the optimal data structure to use?")
                }
                disabled={isAiThinking}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 px-2 py-1 text-[11px] text-slate-300 text-left transition-colors cursor-pointer"
              >
                💡 Request a hint
              </button>
              <button
                type="button"
                onClick={() =>
                  onSubmitCandidateResponse("Can you clarify the constraints on the input string?")
                }
                disabled={isAiThinking}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 px-2 py-1 text-[11px] text-slate-300 text-left transition-colors cursor-pointer"
              >
                ❓ Clarify bounds
              </button>
            </div>

            <div className="relative flex items-center gap-1">
              <input
                type="text"
                value={candidateResponse}
                onChange={(e) => onCandidateResponseChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isAiThinking}
                placeholder="Ask the interviewer anything..."
                className="w-full rounded-md border border-white/10 bg-slate-950 px-2.5 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <Button
                type="button"
                onClick={() => onSubmitCandidateResponse()}
                disabled={!candidateResponse.trim() || isAiThinking}
                size="sm"
                className="h-7 shrink-0 bg-indigo-600 px-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-40"
              >
                <Send className="h-2.5 w-2.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

