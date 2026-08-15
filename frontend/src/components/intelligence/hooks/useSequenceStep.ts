import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

/**
 * Turns the scroll progress of a container into a bounded step index.
 * Mirrors the how-it-works `useTimeline` pattern: one scroll listener,
 * one deterministic state progression — no timers, no duplicate content.
 */
export function useSequenceStep(stepCount: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const nextIndex = Math.min(stepCount - 1, Math.max(0, Math.floor(value * stepCount)));
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  return { containerRef, activeIndex };
}