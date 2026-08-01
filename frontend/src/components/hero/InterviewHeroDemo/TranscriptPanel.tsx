import { motion } from "framer-motion";

type TranscriptPanelProps = {
  text: string;
  paused: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export function TranscriptPanel({ text, paused, onMouseEnter, onMouseLeave }: TranscriptPanelProps) {
  return (
    <motion.div
      className="rounded-[24px] border border-border/70 bg-card p-5 shadow-card"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Transcript</p>
      <p className="mt-3 min-h-28 text-base leading-7 text-foreground">
        {text}
        <span aria-hidden="true" className={paused ? "opacity-0" : "animate-pulse"}>
          |
        </span>
      </p>
    </motion.div>
  );
}
