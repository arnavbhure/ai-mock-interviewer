import { motion } from "framer-motion";

type WaveformProps = {
  bars: number[];
  paused?: boolean;
};

export function Waveform({ bars, paused = false }: WaveformProps) {
  return (
    <div className="flex h-14 items-end gap-1.5" aria-hidden="true">
      {bars.map((bar, index) => (
        <motion.span
          key={`${index}-${bar}`}
          animate={{ height: `${bar}%`, opacity: paused ? 0.55 : 1 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-1.5 rounded-full bg-primary/80"
        />
      ))}
    </div>
  );
}
