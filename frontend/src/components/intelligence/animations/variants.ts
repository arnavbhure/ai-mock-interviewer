import type { Variants } from "framer-motion";

/** Signature easing for the section — mirrors the design system easing. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Calm reveal used for the stacked (mobile / reduced-motion) layouts. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};