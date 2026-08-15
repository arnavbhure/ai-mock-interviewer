import type { ReactNode } from "react";

/** Small uppercase accent label used at the top of each step panel. */
export function StepLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-primary">
      {children}
    </p>
  );
}