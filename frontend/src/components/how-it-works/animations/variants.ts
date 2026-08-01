import type { Variants } from "framer-motion";
import { PREMIUM_EASING } from "@/components/hero/animations/transitions";

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: PREMIUM_EASING, staggerChildren: 0.08 },
  },
};

export const timelineItemReveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: PREMIUM_EASING },
  },
};

export const demoFloat: Variants = {
  hidden: { y: 0 },
  visible: {
    y: [0, -4, 0],
    transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
  },
};
