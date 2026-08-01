import { useEffect, useState } from "react";

export function useDemoLoop(durationMs = 19000, paused = false) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (paused) {
      return;
    }

    const frameMs = 50;
    const intervalId = window.setInterval(() => {
      setElapsedMs((current) => (current + frameMs) % durationMs);
    }, frameMs);

    return () => window.clearInterval(intervalId);
  }, [durationMs, paused]);

  const seekTo = (nextElapsedMs: number) => {
    setElapsedMs(((nextElapsedMs % durationMs) + durationMs) % durationMs);
  };

  const reset = () => setElapsedMs(0);

  return { elapsedMs, seekTo, reset };
}
