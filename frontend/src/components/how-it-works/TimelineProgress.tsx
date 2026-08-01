import type { MotionValue } from "framer-motion";
import { motion, useTransform } from "framer-motion";

type TimelineProgressProps = {
  progress: MotionValue<number>;
};

export function TimelineProgress({ progress }: TimelineProgressProps) {
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="absolute left-4 top-2 hidden h-full w-px bg-border lg:block">
      <motion.div className="h-full w-full origin-top bg-primary" style={{ scaleY }} />
    </div>
  );
}
