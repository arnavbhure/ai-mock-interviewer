import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { HERO_ANNOUNCEMENT } from "@/components/hero/constants/hero.constants";
import { fadeUpItem } from "@/components/hero/animations/variants";

export function HeroHeadline() {
  return (
    <motion.div variants={fadeUpItem} className="space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-card">
        <Sparkles size={16} strokeWidth={1.75} className="text-primary" />
        <span>{HERO_ANNOUNCEMENT}</span>
      </div>

      <h1 className="max-w-2xl text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-6xl lg:text-[4.75rem]">
        Practice Interviews
        <br />
        That Feel Real.
      </h1>
    </motion.div>
  );
}
