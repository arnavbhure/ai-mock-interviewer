import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

export function useTimeline(stepCount: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const nextIndex = Math.min(stepCount - 1, Math.max(0, Math.floor(value * stepCount)));
    setActiveIndex(nextIndex);
  });

  useEffect(() => {
    setActiveIndex(0);
  }, [stepCount]);

  return {
    containerRef,
    activeIndex,
    progress: scrollYProgress,
  };
}
