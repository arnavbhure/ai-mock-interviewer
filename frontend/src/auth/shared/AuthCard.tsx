import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type AuthCardProps = {
  children: ReactNode;
};

export function AuthCard({ children }: AuthCardProps) {
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
        className="rounded-card border border-border/80 bg-card/90 p-6 shadow-modal backdrop-blur-sm transition-shadow duration-300 ease-premium hover:shadow-[0_18px_50px_rgba(15,23,42,0.14)] sm:p-8 lg:p-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
