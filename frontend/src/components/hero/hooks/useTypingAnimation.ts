import { useEffect, useMemo, useState } from "react";

type UseTypingAnimationOptions = {
  text: string;
  active: boolean;
  paused?: boolean;
  speedMs?: number;
};

export function useTypingAnimation({ text, active, paused = false, speedMs = 22 }: UseTypingAnimationOptions) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active || paused) {
      return;
    }

    setCount(0);

    const intervalId = window.setInterval(() => {
      setCount((current) => {
        if (current >= text.length) {
          window.clearInterval(intervalId);
          return current;
        }

        return current + 1;
      });
    }, speedMs);

    return () => window.clearInterval(intervalId);
  }, [active, paused, speedMs, text]);

  const displayedText = useMemo(() => text.slice(0, count), [count, text]);

  return {
    displayedText,
    isComplete: count >= text.length,
  };
}
