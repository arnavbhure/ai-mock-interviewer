import { motion } from "framer-motion";
import { fadeUpItem } from "@/components/hero/animations/variants";

export function HeroDescription() {
  return (
    <motion.p
      variants={fadeUpItem}
      className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl"
    >
      Practice technical, behavioral, and system design interviews with an AI interviewer that
      listens, adapts, and delivers personalized feedback after every interview.
    </motion.p>
  );
}
