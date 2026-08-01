import { motion } from "framer-motion";
import { HeroActions } from "@/components/hero/HeroActions";
import { HeroDescription } from "@/components/hero/HeroDescription";
import { HeroHeadline } from "@/components/hero/HeroHeadline";
import { HeroStats } from "@/components/hero/HeroStats";
import { staggerContainer } from "@/components/hero/animations/variants";

export function HeroContent() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8">
      <HeroHeadline />
      <HeroDescription />
      <HeroActions />
      <HeroStats />
    </motion.div>
  );
}
