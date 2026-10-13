import { useMemo, Component, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mic, BrainCircuit, Volume2 } from "lucide-react";
import type { OrbState } from "@/types/interview.types";
import { Orb } from "@/components/ui/Orb";
import { cn } from "@/lib/utils";

class OrbErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[AIOrb] Caught Orb render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function FallbackOrbVisual({ hue = 0 }: { hue?: number }) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-950/40 select-none"
      style={{ filter: `hue-rotate(${hue}deg)` }}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-600/30 via-purple-600/30 to-cyan-500/30 blur-xl animate-pulse" />
      <div
        className="absolute inset-3 rounded-full opacity-90 animate-spin"
        style={{
          animationDuration: "14s",
          background:
            "radial-gradient(circle at 35% 35%, rgba(147, 51, 234, 0.8) 0%, rgba(99, 102, 241, 0.6) 35%, rgba(6, 182, 212, 0.4) 65%, transparent 80%)",
        }}
      />
      <div
        className="absolute inset-6 rounded-full opacity-80 animate-spin"
        style={{
          animationDuration: "9s",
          animationDirection: "reverse",
          background:
            "radial-gradient(circle at 65% 65%, rgba(59, 130, 246, 0.7) 0%, rgba(168, 85, 247, 0.5) 40%, transparent 75%)",
        }}
      />
      <div className="absolute inset-10 rounded-full bg-white/10 blur-md backdrop-blur-sm" />
    </div>
  );
}

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
          badgeColor: "text-indigo-400",
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
          badgeColor: "text-emerald-400",
        };
      case "thinking":
        return {
          hue: 285,
          hoverIntensity: 0.85,
          glowColor: "rgba(168, 85, 247, 0.25)",
          ringColor: "rgba(192, 132, 252, 0.35)",
          glowScale: [1, 1.12, 1],
          duration: 1.6,
          label: "Thinking...",
          badgeColor: "text-purple-300",
        };
      case "processing":
        return {
          hue: 205,
          hoverIntensity: 0.45,
          glowColor: "rgba(14, 165, 233, 0.2)",
          ringColor: "rgba(56, 189, 248, 0.3)",
          glowScale: [1, 1.06, 1],
          duration: 2.0,
          label: "Processing your answer...",
          badgeColor: "text-cyan-400",
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
          badgeColor: "text-slate-400",
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
          className="pointer-events-none absolute h-[115%] w-[115%] rounded-full border border-dashed"
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
          "relative aspect-square overflow-hidden rounded-full bg-transparent shrink-0",
          !size && "h-[260px] w-[260px] sm:h-[300px] sm:w-[300px] md:h-[340px] md:w-[340px] lg:h-[360px] lg:w-[360px]",
        )}
      >
        <OrbErrorBoundary fallback={<FallbackOrbVisual hue={activeHue} />}>
          <Orb
            hue={activeHue}
            hoverIntensity={activeHoverIntensity}
            rotateOnHover={rotateOnHover}
            forceHoverState={forceHoverState}
            backgroundColor={backgroundColor}
          />
        </OrbErrorBoundary>

        {/* Speaking audio badge indicator */}
        <AnimatePresence>
          {normalized === "speaking" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/60 shadow-sm backdrop-blur-md border border-indigo-500/30 sm:h-12 sm:w-12">
                <Volume2 className="h-5 w-5 text-indigo-400 sm:h-6 sm:w-6 animate-pulse" />
              </div>
            </motion.div>
          )}

          {/* Listening mic badge indicator */}
          {normalized === "listening" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/60 shadow-sm backdrop-blur-md border border-emerald-500/30 sm:h-12 sm:w-12">
                <Mic className="h-5 w-5 text-emerald-400 sm:h-6 sm:w-6 animate-pulse" />
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
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/60 shadow-sm backdrop-blur-md border border-purple-500/30 sm:h-12 sm:w-12">
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
              <div className="flex items-center gap-1.5 rounded-full bg-slate-950/60 px-3 py-1.5 shadow-sm backdrop-blur-md border border-cyan-500/30">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-cyan-400"
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
          className={cn(
            "mt-1 text-xs font-medium tracking-wide transition-colors duration-300",
            stageConfig.badgeColor,
          )}
        >
          {stageConfig.label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default AIOrb;
