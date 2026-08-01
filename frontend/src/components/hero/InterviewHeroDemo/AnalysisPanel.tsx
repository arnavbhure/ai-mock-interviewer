import { motion } from "framer-motion";

type AnalysisPanelProps = {
  progress: number;
};

export function AnalysisPanel({ progress }: AnalysisPanelProps) {
  return (
    <motion.div className="rounded-[26px] border border-border/70 bg-card p-5 shadow-card">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary">Analyzing your response...</p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        The system is scoring technical depth, communication, and problem solving.
      </p>
    </motion.div>
  );
}
