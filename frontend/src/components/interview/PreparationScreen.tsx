import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import { PreparationStepList } from "./PreparationStepList";
import { ShinyText } from "@/components/ShinyText/ShinyText";
import type { PreparationStep } from "@/types/interview.types";
import { MOCK_INTERVIEW_CONFIG } from "@/data/interview.mock";
import dashboardBg from "@/assets/background_image_dashboard.png";

type Props = {
  currentStep: PreparationStep;
  completedSteps: PreparationStep[];
  preparationError: string | null;
};

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Dynamic contextual messages that change with the active step. */
const STEP_STATUS_MESSAGES: Partial<Record<PreparationStep, string>> = {
  ANALYZING_RESUME: "Analyzing your experience and qualifications...",
  UNDERSTANDING_EXPERIENCE: "Identifying key skills and project patterns...",
  BUILDING_PLAN: "Structuring a personalized interview plan...",
  PREPARING_QUESTIONS: "Generating questions tailored to your background...",
  PREPARING_INTERVIEWER: "Calibrating your AI interviewer...",
  COMPLETE: "Everything is ready.",
};

/** Interview context metadata pills. */
const INTERVIEW_META = [
  { label: "Role", value: MOCK_INTERVIEW_CONFIG.role },
  { label: "Difficulty", value: MOCK_INTERVIEW_CONFIG.difficulty },
  { label: "Type", value: MOCK_INTERVIEW_CONFIG.type },
] as const;

export function PreparationScreen({
  currentStep,
  completedSteps,
  preparationError,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background">
      {/* ── Subtle dashboard background ─────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${dashboardBg})`,
          opacity: 0.06,
        }}
        aria-hidden="true"
      />
      {/* Soft lavender overlay for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(247, 248, 250, 0.92) 0%, rgba(237, 240, 255, 0.88) 50%, rgba(247, 248, 250, 0.95) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Background radial glow ──────────────────────────── */}
      <motion.div
        className="absolute left-1/2 top-[38%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, rgba(99, 102, 241, 0.03) 50%, transparent 70%)",
        }}
        animate={
          reduced
            ? undefined
            : { scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* ── Main content ────────────────────────────────────── */}
      <div className="relative z-10 flex w-full max-w-[480px] flex-col items-center px-6 py-12">
        {/* ── AI Preparation Orb ────────────────────────────── */}
        <motion.div
          initial={reduced ? false : { scale: 0.7, opacity: 0 }}
          animate={reduced ? false : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease }}
          className="relative flex items-center justify-center"
        >
          {/* Ripple ring 1 — outermost */}
          <motion.div
            className="absolute h-[120px] w-[120px] rounded-full border border-primary/8"
            animate={
              reduced
                ? undefined
                : { scale: [1, 1.25], opacity: [0.4, 0] }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
            }}
            aria-hidden="true"
          />

          {/* Ripple ring 2 — delayed */}
          <motion.div
            className="absolute h-[120px] w-[120px] rounded-full border border-primary/6"
            animate={
              reduced
                ? undefined
                : { scale: [1, 1.4], opacity: [0.3, 0] }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1,
            }}
            aria-hidden="true"
          />

          {/* Glow halo */}
          <motion.div
            className="absolute h-[100px] w-[100px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)",
            }}
            animate={
              reduced
                ? undefined
                : { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            aria-hidden="true"
          />

          {/* Rotating thin ring */}
          <motion.div
            className="absolute h-[88px] w-[88px] rounded-full border border-primary/10"
            style={{
              borderTopColor: "rgba(79, 70, 229, 0.25)",
            }}
            animate={reduced ? undefined : { rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            aria-hidden="true"
          />

          {/* Core orb */}
          <motion.div
            className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, rgba(238, 242, 255, 0.95) 0%, rgba(224, 231, 255, 0.8) 40%, rgba(199, 210, 254, 0.5) 70%, rgba(165, 180, 252, 0.25) 100%)",
              boxShadow:
                "0 0 24px rgba(79, 70, 229, 0.12), 0 0 48px rgba(99, 102, 241, 0.06), inset 0 -2px 8px rgba(79, 70, 229, 0.05)",
            }}
            animate={
              reduced
                ? undefined
                : { scale: [1, 1.04, 1] }
            }
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Inner highlight */}
            <div
              className="absolute left-[18%] top-[14%] h-[32%] w-[32%] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />
            <BrainCircuit className="h-7 w-7 text-primary" />
          </motion.div>
        </motion.div>

        {/* ── Heading ──────────────────────────────────────── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.15 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <ShinyText
            text="InterviewAI"
            speed={6}
            disabled={Boolean(reduced)}
            className="text-[10px] font-semibold tracking-[0.2em] uppercase"
          />
          <h1 className="text-center text-[1.4rem] font-semibold tracking-tight text-text sm:text-2xl">
            Preparing your interview
          </h1>
          <p className="max-w-xs text-center text-sm leading-relaxed text-text-secondary">
            Tailoring your interview to your experience and target role.
          </p>
        </motion.div>

        {/* ── Step Progress ────────────────────────────────── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.3 }}
          className="mt-10 w-full rounded-xl border border-border/60 bg-surface/70 px-6 py-5 shadow-card backdrop-blur-sm"
        >
          <PreparationStepList
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </motion.div>

        {/* ── Dynamic status message ───────────────────────── */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? false : { opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="mt-5 flex h-6 items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 0.7, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease }}
              className="text-center text-xs font-medium text-text-secondary"
            >
              {STEP_STATUS_MESSAGES[currentStep] ?? ""}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* ── Interview context metadata ───────────────────── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.55 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          {INTERVIEW_META.map((meta) => (
            <span
              key={meta.label}
              className="inline-flex items-center gap-1.5 rounded-pill border border-border/50 bg-surface/60 px-3 py-1 text-[11px] backdrop-blur-sm"
            >
              <span className="font-medium text-text-muted">{meta.label}</span>
              <span className="text-text-secondary">{meta.value}</span>
            </span>
          ))}
        </motion.div>

        {/* ── Error state ──────────────────────────────────── */}
        {preparationError && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-lg border border-error/20 bg-error/5 px-4 py-3"
          >
            <p className="text-center text-sm text-error">
              {preparationError}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
