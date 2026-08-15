import { motion, useReducedMotion } from "framer-motion";
import { Mic } from "lucide-react";
import { DEMO_INTERVIEW } from "@/components/interview-experience/demo.data";

/** Number of bars in the "AI listening" waveform. */
const WAVEFORM_BARS = [0, 1, 2, 3, 4];

/**
 * Small, subtle animated waveform communicating that the AI is listening.
 * The looping scale animation is deterministic (no timers, no state).
 */
export function ListeningIndicator() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5 sm:py-5">
      <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
        <Mic size={14} strokeWidth={1.75} aria-hidden="true" />
        {DEMO_INTERVIEW.listeningLabel}
      </span>

      <div className="flex h-3.5 items-center gap-[3px]" aria-hidden="true">
        {WAVEFORM_BARS.map((bar) => (
          <motion.span
            key={bar}
            initial={false}
            animate={reduceMotion ? { scaleY: 1 } : { scaleY: [1, 0.4, 1] }}
            transition={{
              duration: 0.75,
              ease: "easeInOut",
              repeat: reduceMotion ? 0 : Infinity,
              delay: bar * 0.12,
            }}
            className="h-full w-[2px] origin-center rounded-full bg-primary/80"
          />
        ))}
      </div>
    </div>
  );
}