import { useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mic, BrainCircuit } from "lucide-react";
import type { OrbState } from "@/types/interview.types";
import { Orb } from "@/components/ui/Orb";
import { cn } from "@/lib/utils";

type Props = {
  state?: OrbState;
  className?: string;
  size?: number | string;
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  backgroundColor?: string;
};

type NormalizedState = "speaking" | "listening" | "thinking" | "processing" | "idle";

function normalizeState(state?: OrbState): NormalizedState {
  if (!state) return "idle";
  const s = state.toUpperCase();
  if (s === "AI_SPEAKING" || s === "SPEAKING") return "speaking";
  if (s === "LISTENING") return "listening";
  if (s === "THINKING") return "thinking";
  if (s === "PROCESSING") return "processing";
  return "idle";
}

/**
 * AIOrb Component powered by React Bits WebGL Orb.
 *
 * Distinct visual behaviors across stages:
 * - Speaking:  Active acoustic ripple, vibrant violet-indigo hue
 * - Listening: Calm breathing aura, emerald-teal tone with mic indicator
 * - Thinking:  Rapid swirling neural turbulence, electric purple/magenta hue
 * - Processing: Pulsing cyan-blue focus halo with animated processing dots
 */
export function AIOrb({
  state = "speaking",
  className,
  size,
  hue: customHue,
  hoverIntensity: customHoverIntensity,
  rotateOnHover = true,
  forceHoverState = true,
  backgroundColor = "#000000",
}: Props) {
  const reduced = useReducedMotion();
  const normalized = normalizeState(state);

  const stageConfig = useMemo(() => {
    switch (normalized) {
      case "speaking":
        return {
          hue: 0,
          hoverIntensity: 0.65,
          glowColor: "rgba(79, 70, 229, 0.22)",
          ringColor: "rgba(99, 102, 241, 0.3)",
          glowScale: [1, 1.08, 1],
          duration: 2.2,
          label: "Speaking",
        };
      case "listening":
        return {
          hue: 130,
          hoverIntensity: 0.28,
          glowColor: "rgba(16, 185, 129, 0.2)",
          ringColor: "rgba(52, 211, 153, 0.35)",
          glowScale: [1, 1.04, 1],
          duration: 2.8,
          label: "Listening",
        };
      case "thinking":
        return {
          hue: 285,
          hoverIntensity: 0.85,
          glowColor: "rgba(168, 85, 247, 0.25)",
          ringColor: "rgba(192, 132, 252, 0.35)",
          glowScale: [1, 1.12, 1],
          duration: 1.6,
          label: "Thinking",
        };
      case "processing":
        return {
          hue: 205,
          hoverIntensity: 0.45,
          glowColor: "rgba(14, 165, 233, 0.2)",
          ringColor: "rgba(56, 189, 248, 0.3)",
          glowScale: [1, 1.06, 1],
          duration: 2.0,
          label: "Processing",
        };
      case "idle":
      default:
        return {
          hue: 0,
          hoverIntensity: 0.2,
          glowColor: "rgba(79, 70, 229, 0.12)",
          ringColor: "rgba(99, 102, 241, 0.2)",
          glowScale: [1, 1.02, 1],
          duration: 3.2,
          label: "Ready",
        };
    }
  }, [normalized]);

  const activeHue = customHue ?? stageConfig.hue;
  const activeHoverIntensity = customHoverIntensity ?? stageConfig.hoverIntensity;

  const containerStyle = size
    ? {
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
      }
    : undefined;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center select-none",
        className,
      )}
      role="img"
      aria-label={`AI interviewer is ${stageConfig.label.toLowerCase()}`}
    >
      {/* Outer ambient glow */}
      <motion.div
        className="pointer-events-none absolute -inset-6 rounded-full blur-2xl sm:-inset-10"
        style={{ background: stageConfig.glowColor }}
        animate={
          reduced
            ? false
            : {
                scale: stageConfig.glowScale,
                opacity: [0.6, 1, 0.6],
              }
        }
        transition={{
          duration: stageConfig.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />

      {/* Rotating orbit ring for thinking stage */}
      {normalized === "thinking" && (
        <motion.div
          className="pointer-events-none absolute h-[110%] w-[110%] rounded-full border border-dashed"
          style={{ borderColor: stageConfig.ringColor }}
          animate={reduced ? false : { rotate: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        />
      )}

      {/* WebGL Orb Canvas Container */}
      <div
        style={containerStyle}
        className={cn(
          "relative h-[220px] w-[220px] sm:h-[280px] sm:w-[280px] md:h-[320px] md:w-[320px]",
        )}
      >
        <Orb
          hue={activeHue}
          hoverIntensity={activeHoverIntensity}
          rotateOnHover={rotateOnHover}
          forceHoverState={forceHoverState}
          backgroundColor={backgroundColor}
        />

        {/* Listening mic badge indicator */}
        <AnimatePresence>
          {normalized === "listening" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/40 shadow-sm backdrop-blur-md border border-white/10 sm:h-12 sm:w-12">
                <Mic className="h-5 w-5 text-emerald-400 sm:h-6 sm:w-6" />
              </div>
            </motion.div>
          )}

          {/* Thinking brain badge indicator */}
          {normalized === "thinking" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/30 shadow-sm backdrop-blur-md border border-white/10 sm:h-12 sm:w-12">
                <BrainCircuit className="h-5 w-5 text-purple-300 sm:h-6 sm:w-6" />
              </div>
            </motion.div>
          )}

          {/* Processing animated dots */}
          {normalized === "processing" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="flex items-center gap-1.5 rounded-full bg-surface/40 px-3 py-1.5 shadow-sm backdrop-blur-md border border-white/10">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-sky-400"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: i * 0.18,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stage Status Label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={stageConfig.label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="mt-2 text-xs font-medium tracking-wide text-text-muted sm:text-sm"
        >
          {stageConfig.label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default AIOrb;
