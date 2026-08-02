import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type ResendTimerProps = {
  onResend: () => Promise<void>;
  isResending: boolean;
};

const RESEND_COOLDOWN_SECONDS = 30;

export function ResendTimer({ onResend, isResending }: ResendTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const canResend = secondsLeft === 0 && !isResending;

  const handleResend = async () => {
    if (!canResend) {
      return;
    }

    await onResend();
    setSecondsLeft(RESEND_COOLDOWN_SECONDS);
  };

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
      <span>Didn&apos;t receive a code?</span>

      {canResend ? (
        <motion.button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 font-medium text-primary transition-colors duration-250 ease-premium hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          {isResending ? (
            <>
              <Loader2 size={14} strokeWidth={1.75} className="animate-spin" />
              Resending...
            </>
          ) : (
            "Resend code"
          )}
        </motion.button>
      ) : (
        <span className="font-mono tabular-nums text-foreground">
          Resend in {secondsLeft}s
        </span>
      )}
    </div>
  );
}

