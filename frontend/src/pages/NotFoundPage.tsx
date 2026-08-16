import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotFoundBackground } from "./NotFoundBackground";

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export function NotFoundPage() {
  const reduced = useReducedMotion();

  const transition = (delay: number) => ({
    duration: 0.4,
    ease: [0.25, 1, 0.5, 1],
    delay: reduced ? 0 : delay,
  });

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background p-5 text-center text-foreground">
      <NotFoundBackground />
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
        className="relative z-10 flex flex-col items-center gap-4"
      >
        <motion.p
          variants={FADE_IN_VARIANTS}
          transition={transition(0.1)}
          className="font-mono text-sm font-medium uppercase tracking-widest text-accent"
        >
          Error 404
        </motion.p>
        <motion.h1
          variants={FADE_IN_VARIANTS}
          transition={transition(0.2)}
          className="text-4xl font-bold tracking-tight text-text sm:text-5xl"
        >
          Page Not Found
        </motion.h1>
        <motion.p
          variants={FADE_IN_VARIANTS}
          transition={transition(0.3)}
          className="max-w-md text-base text-text-secondary m-18"
        >
          The page you're looking for doesn't exist or may have been moved.
        </motion.p>
        <motion.div
          variants={FADE_IN_VARIANTS}
          transition={transition(0.4)}
          className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:justify-center"
        >
          <Button asChild variant="outline" size="default">
            <Link to="/dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="primary" size="default">
            <Link to="/">
              Back to Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          delay: reduced ? 0 : 0.5,
        }}
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center text-[20vw] font-black leading-none text-primary/18 sm:text-[180px]"
        aria-hidden="true"
      >
        404
      </motion.p>
    </div>
  );
}
