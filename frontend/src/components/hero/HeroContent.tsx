import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroContentProps {
  reduceMotion: boolean;
}

export function HeroContent({ reduceMotion }: HeroContentProps) {
  // Single vertical content column — left side of the hero,
  // ~40–45% of the desktop composition.
  return (
    <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
      <div className="flex max-w-[640px] flex-col items-start gap-6 py-20 sm:gap-7 lg:py-24">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.5,
            delay: reduceMotion ? 0 : 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-xs font-medium uppercase tracking-[0.28em] text-text-secondary sm:text-sm"
        >
          AI Mock Interviewer
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-full max-w-[640px] text-[clamp(2.25rem,4.2vw,2.875rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-text"
        >
          PREPARE FOR THE
          <br />
          INTERVIEW THAT MATTERS.
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.5,
            delay: reduceMotion ? 0 : 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="max-w-md text-base leading-7 text-text-secondary sm:text-lg sm:leading-8"
        >
          Real interviews.
          <br />
          Real-time feedback.
          <br />
          Real improvement.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.5,
            delay: reduceMotion ? 0 : 0.28,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-2"
        >
          <Button asChild size="lg" className="gap-2 px-6">
            <Link to="/register">
              Start Interview
              <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
