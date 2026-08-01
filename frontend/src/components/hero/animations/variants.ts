import type { Variants } from "framer-motion";
import { PREMIUM_EASING } from "@/components/hero/animations/transitions";

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: PREMIUM_EASING } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

export const demoCard: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: PREMIUM_EASING } },
};
