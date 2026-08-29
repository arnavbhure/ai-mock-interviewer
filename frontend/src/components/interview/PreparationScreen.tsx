import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BrainCircuit, AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShinyText } from "@/components/ShinyText/ShinyText";
import { Button } from "@/components/ui/button";
import { PreparationStepList } from "./PreparationStepList";
import {
  PREPARATION_STEPS,
  type PreparationStep,
} from "@/types/interview.types";
import { useInterviewStore } from "@/store/interview.store";
import dashboardBg from "@/assets/background_image_dashboard.png";

type Props = {
  role?: string | null;
  difficulty?: string | null;
  resumeFileName?: string | null;
  preparationError?: string | null;
  isProcessing?: boolean;
  onRetry?: () => void;
  onBack?: () => void;
};

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STEP_TIMINGS: { step: PreparationStep; delayMs: number }[] = [
  { step: "READING_RESUME", delayMs: 1600 },
  { step: "UNDERSTANDING_EXPERIENCE", delayMs: 2000 },
  { step: "STRUCTURING_PROFILE", delayMs: 2200 },
  { step: "PREPARING_CONTEXT", delayMs: 2500 },
  { step: "FINALIZING_INTERVIEW", delayMs: 0 },
];

export function PreparationScreen({
  role,
  difficulty,
  resumeFileName,
  preparationError,
  isProcessing = true,
  onRetry,
  onBack,
}: Props) {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  const storeRole = useInterviewStore((s) => s.role);
  const storeDifficulty = useInterviewStore((s) => s.difficulty);
  const storeResumeFileName = useInterviewStore((s) => s.resumeFileName);
  const storeError = useInterviewStore((s) => s.error);

  const displayRole = role || storeRole || "Target Role";
  const displayDifficulty = difficulty || storeDifficulty || "medium";
  const displayResumeName = resumeFileName || storeResumeFileName || "resume.pdf";
  const displayError = preparationError || storeError?.message;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<PreparationStep[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Dynamic progression through visual stages while request is pending ──
  useEffect(() => {
    if (!isProcessing || displayError) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // Advance steps 0 -> 1 -> 2 -> 3 -> 4 (hold on step 4 active while pending)
    if (currentStepIndex < PREPARATION_STEPS.length - 1) {
      const timing = STEP_TIMINGS[currentStepIndex];
      timerRef.current = setTimeout(() => {
        const nextIdx = currentStepIndex + 1;
        const finishedStep = PREPARATION_STEPS[currentStepIndex];
        setCompletedSteps((prev) =>
          prev.includes(finishedStep) ? prev : [...prev, finishedStep],
        );
        setCurrentStepIndex(nextIdx);
      }, timing?.delayMs ?? 2000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStepIndex, isProcessing, displayError]);

  // Reset steps if user retries
  const handleRetryClick = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    onRetry?.();
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/dashboard/new");
    }
  };

  const currentStep = PREPARATION_STEPS[currentStepIndex] || "READING_RESUME";

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-8 sm:px-6 sm:py-12">
      {/* ── Subtle dashboard background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url(${dashboardBg})`,
          opacity: 0.06,
        }}
        aria-hidden="true"
      />
      {/* Soft lavender overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(247, 248, 250, 0.92) 0%, rgba(237, 240, 255, 0.88) 50%, rgba(247, 248, 250, 0.95) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Background radial ambient glow ── */}
      <motion.div
        className="absolute left-1/2 top-[36%] h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(79, 70, 229, 0.09) 0%, rgba(99, 102, 241, 0.03) 50%, transparent 70%)",
        }}
        animate={
          reduced
            ? undefined
            : { scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* ── Main card container ── */}
      <div className="relative z-10 flex w-full max-w-[500px] flex-col items-center">
        {/* ── AI Preparation Orb ── */}
        <motion.div
          initial={reduced ? false : { scale: 0.75, opacity: 0 }}
          animate={reduced ? false : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease }}
          className="relative flex items-center justify-center"
        >
          {/* Ripple ring 1 — outermost */}
          <motion.div
            className="absolute h-[116px] w-[116px] rounded-full border border-primary/10"
            animate={
              reduced
                ? undefined
                : { scale: [1, 1.28], opacity: [0.45, 0] }
            }
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
            aria-hidden="true"
          />

          {/* Ripple ring 2 — delayed */}
          <motion.div
            className="absolute h-[116px] w-[116px] rounded-full border border-primary/8"
            animate={
              reduced
                ? undefined
                : { scale: [1, 1.42], opacity: [0.35, 0] }
            }
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.9,
            }}
            aria-hidden="true"
          />

          {/* Glow halo */}
          <motion.div
            className="absolute h-[96px] w-[96px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, transparent 70%)",
            }}
            animate={
              reduced
                ? undefined
                : { scale: [1, 1.12, 1], opacity: [0.65, 1, 0.65] }
            }
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            aria-hidden="true"
          />

          {/* Rotating orbit ring */}
          <motion.div
            className="absolute h-[84px] w-[84px] rounded-full border border-primary/15"
            style={{
              borderTopColor: "rgba(79, 70, 229, 0.35)",
            }}
            animate={reduced ? undefined : { rotate: 360 }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "linear",
            }}
            aria-hidden="true"
          />

          {/* Core visual orb */}
          <motion.div
            className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full shadow-lg"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, rgba(238, 242, 255, 0.98) 0%, rgba(224, 231, 255, 0.85) 40%, rgba(199, 210, 254, 0.55) 70%, rgba(165, 180, 252, 0.3) 100%)",
              boxShadow:
                "0 0 24px rgba(79, 70, 229, 0.15), 0 0 48px rgba(99, 102, 241, 0.08), inset 0 -2px 8px rgba(79, 70, 229, 0.08)",
            }}
            animate={
              reduced
                ? undefined
                : { scale: [1, 1.04, 1] }
            }
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div
              className="absolute left-[18%] top-[14%] h-[32%] w-[32%] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />
            <BrainCircuit className="h-7 w-7 text-primary" />
          </motion.div>
        </motion.div>

        {/* ── Heading ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.1 }}
          className="mt-7 flex flex-col items-center gap-2 text-center"
        >
          <ShinyText
            text="InterviewAI"
            speed={6}
            disabled={Boolean(reduced)}
            className="text-[10px] font-semibold tracking-[0.2em] uppercase"
          />
          <h1 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">
            {displayError ? "Preparation Error" : "Preparing your interview"}
          </h1>
          <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-text-secondary">
            {displayError
              ? "We encountered an issue while processing your resume."
              : "Analyzing your resume to customize interview questions and context."}
          </p>
        </motion.div>

        {/* ── Step Progress Indicator (Visible when not in error) ── */}
        {!displayError && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={reduced ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.2 }}
            className="mt-8 w-full rounded-2xl border border-border/70 bg-surface/80 px-6 py-5 shadow-card backdrop-blur-md"
          >
            <PreparationStepList
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </motion.div>
        )}

        {/* ── Interview Context Metadata Pills ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease, delay: 0.3 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border/60 bg-surface/70 px-3 py-1 text-[11px] backdrop-blur-sm shadow-xs">
            <span className="font-medium text-text-muted">Role:</span>
            <span className="font-semibold text-text">{displayRole}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border/60 bg-surface/70 px-3 py-1 text-[11px] backdrop-blur-sm shadow-xs">
            <span className="font-medium text-text-muted">Difficulty:</span>
            <span className="font-semibold text-text capitalize">{displayDifficulty}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border/60 bg-surface/70 px-3 py-1 text-[11px] backdrop-blur-sm shadow-xs max-w-[200px]">
            <span className="font-medium text-text-muted">Resume:</span>
            <span className="truncate font-semibold text-text">{displayResumeName}</span>
          </span>
        </motion.div>

        {/* ── Error Banner & Actions ── */}
        <AnimatePresence>
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="mt-8 w-full rounded-2xl border border-red-500/25 bg-red-500/10 p-5 text-left shadow-modal"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                    Failed to Process Resume
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-red-600 dark:text-red-200 break-words [overflow-wrap:anywhere]">
                    {displayError}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3 border-t border-red-500/20 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleBackClick}
                  className="h-8 gap-1.5 text-xs font-medium"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to setup</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleRetryClick}
                  className="h-8 gap-1.5 bg-red-600 text-white hover:bg-red-500 text-xs font-medium"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Retry Upload</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PreparationScreen;
