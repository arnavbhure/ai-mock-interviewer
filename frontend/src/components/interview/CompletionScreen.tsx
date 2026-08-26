import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useInterviewStore } from "@/store/interview.store";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * End-of-interview screen.
 * Clean, centered layout matching the preparation screen style.
 */
export function CompletionScreen() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const reset = useInterviewStore((s) => s.reset);

  function handleReturn() {
    reset();
    navigate("/dashboard");
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background">
      {/* Background glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-success/6 blur-[90px]"
        aria-hidden="true"
      />

      <div className="relative flex w-full max-w-md flex-col items-center px-6 text-center">
        {/* Checkmark */}
        <motion.div
          initial={reduced ? false : { scale: 0.7, opacity: 0 }}
          animate={reduced ? false : { scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.1 }}
          className="mt-7 text-xl font-semibold tracking-tight text-text sm:text-2xl"
        >
          Interview complete
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? false : { opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary"
        >
          Your responses have been recorded. Your performance report will be
          prepared next.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.35 }}
          className="mt-8"
        >
          <Button
            onClick={handleReturn}
            size="lg"
            className="h-11 px-6"
          >
            Return to dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
