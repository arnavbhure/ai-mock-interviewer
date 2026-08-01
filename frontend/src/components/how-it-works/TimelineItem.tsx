import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type TimelineItemProps = {
  index?: number;
  active?: boolean;
  children: ReactNode;
};

export function TimelineItem({ index, active, children }: TimelineItemProps) {
  const itemIndex = index ?? 0;
  const isActive = active ?? false;

  return (
    <motion.div
      className="relative grid gap-4 lg:grid-cols-[auto_1fr] lg:gap-6"
      animate={{ opacity: isActive ? 1 : 0.84 }}
      transition={{ duration: 0.25 }}
    >
      <div className="relative hidden lg:block">
        <div
          className={cn(
            "mt-8 flex size-8 items-center justify-center rounded-full border transition-all duration-300",
            isActive ? "scale-110 border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
          )}
        >
          <span className="text-xs font-semibold">{itemIndex + 1}</span>
        </div>
      </div>

      <div className="lg:pl-2">{children}</div>
    </motion.div>
  );
}
