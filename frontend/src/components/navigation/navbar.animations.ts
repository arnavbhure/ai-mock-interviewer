import type { Variants } from "framer-motion";

export const NAV_EASING = [0.16, 1, 0.3, 1] as const;

export const NAV_DURATION = 0.28;

export const pillVariants: Variants = {
  rest: { y: 0 },
  hover: { y: -1 },
  tap: { y: 0 },
};

export const ctaArrowVariants: Variants = {
  rest: { x: 0 },
  hover: { x: 4 },
  tap: { x: 0 },
};

export const logoVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.03 },
};

export const mobileItemVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.24, ease: NAV_EASING, delay: 0.05 + i * 0.05 },
  }),
};

export const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, x: 28 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: NAV_EASING },
  },
  exit: {
    opacity: 0,
    x: 28,
    transition: { duration: 0.22, ease: NAV_EASING },
  },
};

