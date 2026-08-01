import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { timelineItemReveal } from "@/components/how-it-works/animations/variants";

type StepCardProps = {
  step: string;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function StepCard({ step, title, description, children, className }: StepCardProps) {
  return (
    <motion.article
      variants={timelineItemReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      className={cn("rounded-[30px] border border-border bg-card p-5 shadow-card sm:p-6", className)}
    >
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/8 text-sm font-semibold text-primary">
          {step}
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground sm:text-2xl">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </motion.article>
  );
}
