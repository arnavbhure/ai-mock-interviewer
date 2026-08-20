import { useEffect, useMemo, useState } from "react";

type UseTypingAnimationOptions = {
  text: string;
  active: boolean;
  paused?: boolean;
  speedMs?: number;
};

export function useTypingAnimation({ text, active, paused = false, speedMs = 22 }: UseTypingAnimationOptions) {
  const [count, setCount] = useState(0);

  // Reset typing progress whenever the inputs change.
  // React's recommended "adjust state during render" pattern: compare against
  // the previous inputs stored in state (not a ref), and call setState during
  // render to reset. This avoids both `react-hooks/set-state-in-effect` and
  // `react-hooks/refs`.
  const [prevInputs, setPrevInputs] = useState({ text, active, paused, speedMs });
  if (
    text !== prevInputs.text ||
    active !== prevInputs.active ||
    paused !== prevInputs.paused ||
    speedMs !== prevInputs.speedMs
  ) {
    setPrevInputs({ text, active, paused, speedMs });
    setCount(0);
  }

  useEffect(() => {
    if (!active || paused) {
      return;
    }

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
