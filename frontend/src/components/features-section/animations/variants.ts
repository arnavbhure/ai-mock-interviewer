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

export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: PREMIUM_EASING },
  },
};

export const subtleFloat: Variants = {
  hidden: { y: 0 },
  visible: {
    y: [0, -3, 0],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
};
