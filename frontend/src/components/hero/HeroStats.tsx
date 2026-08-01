import { motion } from "framer-motion";
import { HERO_STATS } from "@/components/hero/constants/hero.constants";
import { fadeUpItem } from "@/components/hero/animations/variants";

export function HeroStats() {
  return (
    <motion.dl variants={fadeUpItem} className="grid gap-4 sm:grid-cols-3">
      {HERO_STATS.map((stat) => (
        <div key={stat.label} className="rounded-[22px] border border-border/70 bg-card p-4 shadow-card">
          <dt className="text-sm font-medium text-muted-foreground">{stat.label}</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground">
            {stat.value}
          </dd>
        </div>
      ))}
    </motion.dl>
  );
}
