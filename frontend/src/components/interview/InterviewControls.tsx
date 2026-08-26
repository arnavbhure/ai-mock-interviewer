import { motion } from "framer-motion";
import { Mic, SkipForward, LogOut } from "lucide-react";
import type { OrbState } from "@/types/interview.types";
import { cn } from "@/lib/utils";

type Props = {
  orbState: OrbState;
  onToggleListening: () => void;
  onSkipQuestion: () => void;
  onEndInterview: () => void;
};

/**
 * Bottom control bar for the live interview.
 * Primary: mic button with state label.
 * Secondary: skip question, end interview.
 */
export function InterviewControls({
  orbState,
  onToggleListening,
  onSkipQuestion,
  onEndInterview,
}: Props) {
  const isListening = orbState === "LISTENING";
  const canInteract = orbState === "LISTENING";

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Primary mic button */}
      <div className="flex flex-col items-center gap-2.5">
        <motion.button
          type="button"
          onClick={onToggleListening}
          disabled={!canInteract}
          whileTap={canInteract ? { scale: 0.93 } : undefined}
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-full transition-all duration-base ease-premium sm:h-16 sm:w-16",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isListening
              ? "bg-primary text-primary-foreground shadow-[0_0_0_4px_rgba(79,70,229,0.15),0_4px_16px_rgba(79,70,229,0.25)]"
              : "border border-border bg-surface text-text-muted",
            !canInteract && "cursor-default opacity-50",
          )}
          aria-label={isListening ? "Stop listening" : "Start responding"}
        >
          <Mic className="h-5 w-5 sm:h-6 sm:w-6" />

          {/* Listening pulse ring */}
          {isListening && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-primary"
              animate={{ scale: [1, 1.25], opacity: [0.5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
              aria-hidden="true"
            />
          )}
        </motion.button>

        <span
          className={cn(
            "text-xs font-medium",
            isListening ? "text-primary" : "text-text-muted",
          )}
        >
          {isListening ? "Listening — tap when done" : "Waiting"}
        </span>
      </div>

      {/* Secondary actions */}
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={onSkipQuestion}
          className="flex items-center gap-1.5 text-xs font-medium text-text-muted transition-colors duration-base ease-premium hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <SkipForward className="h-3.5 w-3.5" aria-hidden="true" />
          Skip question
        </button>
        <span aria-hidden="true" className="h-3 w-px bg-border" />
        <button
          type="button"
          onClick={onEndInterview}
          className="flex items-center gap-1.5 text-xs font-medium text-text-muted transition-colors duration-base ease-premium hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          End interview
        </button>
      </div>
    </div>
  );
}
