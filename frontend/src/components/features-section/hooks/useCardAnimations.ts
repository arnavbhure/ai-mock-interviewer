import { useReducedMotion } from "framer-motion";
import { cardReveal } from "@/components/features-section/animations/variants";

export function useCardAnimations(index: number) {
  const reduceMotion = useReducedMotion();
  const delay = index * 0.06;

  return {
    cardVariants: cardReveal,
    motionProps: {
      initial: reduceMotion ? false : "hidden",
      whileInView: reduceMotion ? undefined : "visible",
      viewport: { once: true, margin: "-80px" },
      transition: { delay },
    },
  };
}
