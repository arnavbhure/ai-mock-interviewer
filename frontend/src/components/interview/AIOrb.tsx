import { motion, useReducedMotion } from "framer-motion";
import { Mic } from "lucide-react";
import type { OrbState } from "@/types/interview.types";
import { cn } from "@/lib/utils";

type Props = {
  state: OrbState;
  className?: string;
};

/**
 * The visual centrepiece of the live interview screen.
 *
 * A CSS + Framer Motion orb that responds to the current OrbState
 * with restrained, elegant animations. No canvas, no particles —
 * just layered radial gradients, box-shadows, and scale transforms.
 */
export function AIOrb({ state, className }: Props) {
  const reduced = useReducedMotion();

  // ── Animation config per state ───────────────────────────

  const pulseConfig = {
    AI_SPEAKING: {
      scale: [1, 1.045, 1],
      duration: 2.2,
    },
    LISTENING: {
      scale: [1, 1.015, 1],
      duration: 3,
    },
    THINKING: {
      scale: [1, 1.03, 1],
      duration: 1.8,
    },
    PROCESSING: {
      scale: [1, 1.02, 1],
      duration: 2,
    },
  }[state];

  const glowOpacity = {
    AI_SPEAKING: 0.35,
    LISTENING: 0.15,
    THINKING: 0.25,
    PROCESSING: 0.2,
  }[state];

  const ringOpacity = {
    AI_SPEAKING: 0.2,
    LISTENING: 0.1,
    THINKING: 0.3,
    PROCESSING: 0.15,
  }[state];

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      role="img"
      aria-label={`AI interviewer is ${state.toLowerCase().replace("_", " ")}`}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute h-[200px] w-[200px] rounded-full sm:h-[240px] sm:w-[240px]"
        style={{
          background:
            "radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, transparent 70%)",
        }}
        animate={
          reduced
            ? false
            : {
                opacity: [glowOpacity, glowOpacity * 1.4, glowOpacity],
                scale: pulseConfig.scale.map((s) => s * 1.2),
              }
        }
        transition={{
          duration: pulseConfig.duration * 1.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />

      {/* Glow ring */}
      <motion.div
        className="orb-ring absolute h-[150px] w-[150px] rounded-full border sm:h-[175px] sm:w-[175px]"
        style={{
          borderColor: `rgba(99, 102, 241, ${ringOpacity})`,
        }}
        animate={
          reduced
            ? false
            : state === "THINKING"
              ? { rotate: 360 }
              : { scale: pulseConfig.scale }
        }
        transition={
          state === "THINKING"
            ? { duration: 6, repeat: Infinity, ease: "linear" }
            : { duration: pulseConfig.duration, repeat: Infinity, ease: "easeInOut" }
        }
        aria-hidden="true"
      />

      {/* Core orb */}
      <motion.div
        className="orb-core relative flex h-[120px] w-[120px] items-center justify-center rounded-full sm:h-[140px] sm:w-[140px]"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgba(224, 231, 255, 0.9) 0%, rgba(199, 210, 254, 0.6) 40%, rgba(165, 180, 252, 0.3) 70%, rgba(129, 140, 248, 0.15) 100%)",
          boxShadow: `
            0 0 40px rgba(79, 70, 229, ${glowOpacity * 0.5}),
            0 0 80px rgba(99, 102, 241, ${glowOpacity * 0.25}),
            inset 0 -4px 12px rgba(79, 70, 229, 0.08)
          `,
        }}
        animate={
          reduced
            ? false
            : { scale: pulseConfig.scale }
        }
        transition={{
          duration: pulseConfig.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Inner highlight */}
        <div
          className="absolute left-[20%] top-[15%] h-[35%] w-[35%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Listening mic indicator */}
        {state === "LISTENING" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-center"
          >
            <Mic className="h-6 w-6 text-primary/60 sm:h-7 sm:w-7" />
          </motion.div>
        )}

        {/* Processing dots */}
        {state === "PROCESSING" && (
          <motion.div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-primary/40"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* State label */}
      <motion.span
        key={state}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute -bottom-8 text-xs font-medium text-text-muted sm:-bottom-9"
      >
        {state === "AI_SPEAKING" && "Speaking"}
        {state === "LISTENING" && "Listening"}
        {state === "THINKING" && "Thinking"}
        {state === "PROCESSING" && "Processing"}
      </motion.span>
    </div>
  );
}
