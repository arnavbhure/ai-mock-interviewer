import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { BrowserToolbar } from "@/components/hero/InterviewHeroDemo/BrowserToolbar";
import { demoCard } from "@/components/hero/animations/variants";

type BrowserWindowProps = {
  children: ReactNode;
  onMouseMove?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export function BrowserWindow({ children, onMouseMove, onMouseEnter, onMouseLeave }: BrowserWindowProps) {
  return (
    <motion.div
      variants={demoCard}
      className="overflow-hidden rounded-[30px] border border-border/70 bg-card shadow-modal"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <BrowserToolbar />
      <div className="relative bg-background p-4 sm:p-5">{children}</div>
    </motion.div>
  );
}
