import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCardAnimations } from "@/components/features-section/hooks/useCardAnimations";

type FeatureCardProps = {
  index: number;
  title: string;
  eyebrow: string;
  description: string;
  className?: string;
  children: ReactNode;
};

export function FeatureCard({ index, title, eyebrow, description, className, children }: FeatureCardProps) {
  const { cardVariants, motionProps } = useCardAnimations(index);

  return (
    <motion.article
      variants={cardVariants}
      {...motionProps}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        "group relative overflow-hidden rounded-[28px] border border-border bg-card p-5 shadow-card transition-shadow duration-300 hover:shadow-hover sm:p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-x-6 top-0 h-px bg-primary/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,124,255,0.08),transparent_55%)]" />
      </div>

      <div className="relative flex h-full flex-col gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">{eyebrow}</p>
          <h3 className="mt-2 text-[1.18rem] font-semibold tracking-[-0.02em] text-foreground">{title}</h3>
          <p className="mt-2 max-w-[32ch] text-sm leading-6 text-muted-foreground">{description}</p>
        </div>

        <div className="relative flex-1">{children}</div>
      </div>
    </motion.article>
  );
}
