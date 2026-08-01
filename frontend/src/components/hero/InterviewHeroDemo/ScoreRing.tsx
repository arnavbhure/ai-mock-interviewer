import { motion } from "framer-motion";
import { useState } from "react";

type ScoreRingProps = {
  value: number;
  showTooltip?: boolean;
};

export function ScoreRing({ value, showTooltip = true }: ScoreRingProps) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg aria-hidden="true" className="size-36 -rotate-90" viewBox="0 0 132 132">
        <circle cx="66" cy="66" r={radius} className="fill-none stroke-muted" strokeWidth="10" />
        <motion.circle
          cx="66"
          cy="66"
          r={radius}
          className="fill-none stroke-primary"
          strokeLinecap="round"
          strokeWidth="10"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tracking-[-0.03em] text-foreground">{value}</span>
        <span className="mt-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">Score</span>
      </div>

      {showTooltip ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 4 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-medium text-foreground shadow-card"
        >
          Overall Interview Score
        </motion.div>
      ) : null}
    </div>
  );
}
