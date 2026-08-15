import type { Variants } from "framer-motion";

/** Signature easing for the section — mirrors the design system easing. */
export const SECTION_EASING = [0.16, 1, 0.3, 1] as const;

/** Calm, one-shot entrance for the left-hand intro copy. */
export const introContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export const introItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: SECTION_EASING } },
};

/**
 * Entrance for the product interface. The panel rises slightly, then its
 * rows appear one after another (question → response → listening → follow-up).
 */
export const demoContainer: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: SECTION_EASING,
      staggerChildren: 0.16,
      delayChildren: 0.25,
    },
  },
};

export const demoRow: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: SECTION_EASING } },
};