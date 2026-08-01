import { useEffect, useState } from "react";

export function useWaveform(active: boolean, paused = false) {
  const [bars, setBars] = useState<number[]>(() => [48, 66, 54, 72, 60, 80, 52, 68, 56, 74, 62, 50]);

  useEffect(() => {
    if (!active || paused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setBars((currentBars) =>
        currentBars.map((bar, index) => {
          const variation = Math.sin(Date.now() / 180 + index) * 10;
          const nextValue = bar + variation;
          return Math.max(24, Math.min(88, Math.round(nextValue)));
        }),
      );
    }, 120);

    return () => window.clearInterval(intervalId);
  }, [active, paused]);

  return bars;
}
