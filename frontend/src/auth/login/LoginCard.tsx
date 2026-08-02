import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type LoginCardProps = {
  children: ReactNode;
};

export function LoginCard({ children }: LoginCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-primary/8 blur-3xl"
      />
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-card border border-border/70 bg-card p-6 shadow-card sm:p-8 lg:p-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

