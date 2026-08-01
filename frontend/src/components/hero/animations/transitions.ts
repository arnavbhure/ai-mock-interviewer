export const PREMIUM_EASING = [0.16, 1, 0.3, 1] as const;

export const TRANSITIONS = {
  fast: { duration: 0.2, ease: PREMIUM_EASING },
  medium: { duration: 0.3, ease: PREMIUM_EASING },
  slow: { duration: 0.4, ease: PREMIUM_EASING },
};
