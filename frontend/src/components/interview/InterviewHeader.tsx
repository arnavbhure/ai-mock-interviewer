import { BrainCircuit } from "lucide-react";

type Props = {
  interviewType: string;
  questionNumber: number;
  totalQuestions: number;
};

/**
 * Compact, minimal header for the live interview screen.
 * Shows brand, interview type, and question counter.
 * No sidebar, no profile dropdown — just interview context.
 */
export function InterviewHeader({
  interviewType,
  questionNumber,
  totalQuestions,
}: Props) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 px-4 sm:px-6">
      {/* Left — Brand */}
      <div className="flex items-center gap-2">
        <BrainCircuit className="h-5 w-5 text-primary" aria-hidden="true" />
        <span className="text-sm font-semibold tracking-tight text-text">
          InterviewAI
        </span>
      </div>

      {/* Center — Interview type */}
      <span className="hidden text-xs font-medium text-text-secondary sm:block">
        {interviewType}
      </span>

      {/* Right — Question counter */}
      <span className="rounded-pill bg-background-secondary px-3 py-1 text-xs font-medium text-text-secondary">
        Question {String(questionNumber).padStart(2, "0")} / {String(totalQuestions).padStart(2, "0")}
      </span>
    </header>
  );
}
