import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HERO_ACTIONS } from "@/components/hero/constants/hero.constants";
import { fadeUpItem } from "@/components/hero/animations/variants";
import { Button } from "@/components/ui/button";

export function HeroActions() {
  return (
    <motion.div variants={fadeUpItem} className="flex flex-wrap items-center gap-4">
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}>
        <Button asChild className="h-12 gap-2 px-5 text-sm font-medium shadow-none">
          <Link to={HERO_ACTIONS[0].href}>
            {HERO_ACTIONS[0].label}
            <ArrowRight size={16} strokeWidth={1.75} />
          </Link>
        </Button>
      </motion.div>

      <Button asChild variant="secondary" className="h-12 px-5 text-sm font-medium">
        <a href={HERO_ACTIONS[1].href}>{HERO_ACTIONS[1].label}</a>
      </Button>
    </motion.div>
  );
}
