import { Children, isValidElement, cloneElement, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TimelineProgress } from "@/components/how-it-works/TimelineProgress";
import { TimelineItem } from "@/components/how-it-works/TimelineItem";
import { useTimeline } from "@/components/how-it-works/hooks/useTimeline";
import { sectionReveal } from "@/components/how-it-works/animations/variants";

type TimelineProps = {
  children: ReactNode;
};

export function Timeline({ children }: TimelineProps) {
  const reduceMotion = useReducedMotion();
  const items = Children.toArray(children);
  const { containerRef, activeIndex, progress } = useTimeline(items.length);

  return (
    <motion.div
      variants={sectionReveal}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, margin: "-120px" }}
      className="relative"
    >
      <div ref={containerRef} className="relative">
        <TimelineProgress progress={progress} />
        <div className="grid gap-4 lg:gap-6">
          {items.map((item, index) =>
            isValidElement(item) && item.type === TimelineItem
              ? cloneElement(item as React.ReactElement<{ index?: number; active?: boolean }>, {
                  index,
                  active: index <= activeIndex,
                })
              : item,
          )}
        </div>
      </div>
      <div className="sr-only">Active timeline step {activeIndex + 1} of 4</div>
    </motion.div>
  );
}
