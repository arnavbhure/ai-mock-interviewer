import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  BrainCircuit,
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
  Clock,
  Sparkles,
  Lightbulb,
  Code2,
  Mic,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
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

type PreparationPhase =
  | "idle"
  | "uploading_resume"
  | "creating_plan"
  | "complete"
  | "error";

type Props = {
  role?: string | null;
  difficulty?: string | null;
  resumeFileName?: string | null;
  preparationPhase?: PreparationPhase;
  preparationError?: string | null;
  isProcessing?: boolean;
  onRetry?: () => void;
  onBack?: () => void;
};

interface PrepTip {
  category: "Role Insight" | "Coding Round" | "Voice & Audio" | "Interview Strategy";
  title: string;
  description: string;
  icon: typeof Lightbulb;
  badgeColor: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

export function PreparationScreen({
  role,
  difficulty,
  resumeFileName,
  preparationPhase = "uploading_resume",
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

  // ── 1. Live Elapsed Timer ──
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isProcessing || displayError || preparationPhase === "complete") return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isProcessing, displayError, preparationPhase]);

  const formattedElapsed = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }, [elapsedSeconds]);

  // ── 2. Synced Step Progression (Tied to real API phases) ──
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<PreparationStep[]>([]);
  const planStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (displayError || !isProcessing) return;

    if (preparationPhase === "uploading_resume") {
      // Step 0: Reading resume (0s) -> Step 1: Understanding experience (2s) -> Step 2: Structuring profile (4s)
      const t1 = setTimeout(() => {
        setCompletedSteps((prev) => Array.from(new Set([...prev, "READING_RESUME"])));
        setCurrentStepIndex(1);
      }, 1800);

      const t2 = setTimeout(() => {
        setCompletedSteps((prev) => Array.from(new Set([...prev, "READING_RESUME", "UNDERSTANDING_EXPERIENCE"])));
        setCurrentStepIndex(2);
      }, 4200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    if (preparationPhase === "creating_plan") {
      // Mark first 3 steps completed
      setCompletedSteps((prev) =>
        Array.from(new Set([...prev, "READING_RESUME", "UNDERSTANDING_EXPERIENCE", "STRUCTURING_PROFILE"])),
      );
      setCurrentStepIndex(3);

      if (!planStartTimeRef.current) {
        planStartTimeRef.current = Date.now();
      }

      const t3 = setTimeout(() => {
        setCompletedSteps((prev) =>
          Array.from(
            new Set([
              ...prev,
              "READING_RESUME",
              "UNDERSTANDING_EXPERIENCE",
              "STRUCTURING_PROFILE",
              "PREPARING_CONTEXT",
            ]),
          ),
        );
        setCurrentStepIndex(4);
      }, 2500);

      const t4 = setTimeout(() => {
        setCompletedSteps((prev) =>
          Array.from(
            new Set([
              ...prev,
              "READING_RESUME",
              "UNDERSTANDING_EXPERIENCE",
              "STRUCTURING_PROFILE",
              "PREPARING_CONTEXT",
              "FINALIZING_INTERVIEW",
            ]),
          ),
        );
        setCurrentStepIndex(5);
      }, 5500);

      return () => {
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }

    if (preparationPhase === "complete") {
      setCompletedSteps([...PREPARATION_STEPS]);
      setCurrentStepIndex(PREPARATION_STEPS.length - 1);
    }
  }, [preparationPhase, isProcessing, displayError]);

  // Calculated approximate progress percentage (0 - 100%)
  const progressPercent = useMemo(() => {
    if (preparationPhase === "complete") return 100;
    if (preparationPhase === "error" || displayError) return 0;
    if (preparationPhase === "uploading_resume") {
      return Math.min(45, 12 + elapsedSeconds * 6);
    }
    if (preparationPhase === "creating_plan") {
      return Math.min(94, 50 + elapsedSeconds * 4);
    }
    return 10;
  }, [preparationPhase, elapsedSeconds, displayError]);

  // ── 3. Role-Aware Tips Carousel ──
  const tips: PrepTip[] = useMemo(() => {
    const roleLower = displayRole.toLowerCase();

    const roleSpecificTips: PrepTip[] = [];
    if (roleLower.includes("front") || roleLower.includes("react") || roleLower.includes("ui")) {
      roleSpecificTips.push(
        {
          category: "Role Insight",
          title: "State Management & Lifecycle",
          description:
            "Be prepared to explain reconciliation, memoization trade-offs, and SSR hydration nuances for high-scale interfaces.",
          icon: Zap,
          badgeColor: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
        },
        {
          category: "Role Insight",
          title: "Rendering Performance",
          description:
            "Highlight Core Web Vitals (LCP, CLS, INP) and bundle size optimization strategies when discussing architecture.",
          icon: Sparkles,
          badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
        },
      );
    } else if (
      roleLower.includes("back") ||
      roleLower.includes("node") ||
      roleLower.includes("python") ||
      roleLower.includes("api")
    ) {
      roleSpecificTips.push(
        {
          category: "Role Insight",
          title: "Database Indexing & Queries",
          description:
            "Discuss B-Tree index cardinality, connection pooling, and how to avoid N+1 queries under concurrent loads.",
          icon: Zap,
          badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
        },
        {
          category: "Role Insight",
          title: "Distributed Consistency",
          description:
            "Clarify idempotency keys in payment/order APIs and explain asynchronous worker queues for long-running jobs.",
          icon: Sparkles,
          badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        },
      );
    } else {
      roleSpecificTips.push({
        category: "Role Insight",
        title: "Full-Stack Ownership",
        description:
          "Demonstrate how client state synchronizes with backend REST/WebSocket APIs, handling failure and reconnection gracefully.",
        icon: Zap,
        badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
      });
    }

    const universalTips: PrepTip[] = [
      {
        category: "Interview Strategy",
        title: "Structure with STAR Method",
        description:
          "For experiential questions, frame responses concisely: Situation (context), Task (objective), Action (what you built), Result (impact).",
        icon: Lightbulb,
        badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      },
      {
        category: "Coding Round",
        title: "State Complexities Early",
        description:
          "Before coding in Monaco, describe your algorithmic approach out loud and clarify Big-O time and space constraints.",
        icon: Code2,
        badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      },
      {
        category: "Voice & Audio",
        title: "Conversational Flexibility",
        description:
          "You can speak naturally via microphone or switch to manual typing at any moment using the input toggle dock.",
        icon: Mic,
        badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      },
    ];

    return [...roleSpecificTips, ...universalTips];
  }, [displayRole]);

  const [activeTipIndex, setActiveTipIndex] = useState(0);

  // Auto-advance tip every 6 seconds
  useEffect(() => {
    if (!tips.length) return;
    const interval = setInterval(() => {
      setActiveTipIndex((prev) => (prev + 1) % tips.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const activeTip = tips[activeTipIndex] || tips[0];

  const handleNextTip = () => {
    setActiveTipIndex((prev) => (prev + 1) % tips.length);
  };

  const handlePrevTip = () => {
    setActiveTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const handleRetryClick = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setElapsedSeconds(0);
    planStartTimeRef.current = null;
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
  const isComplete = preparationPhase === "complete";

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-x-hidden overflow-y-auto bg-background px-4 py-8 sm:px-6 sm:py-12">
      {/* ── Dashboard background texture ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url(${dashboardBg})`,
          opacity: 0.04,
        }}
        aria-hidden="true"
      />

      {/* ── Soft ambient glow backdrop ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(248, 249, 252, 0.94) 0%, rgba(238, 242, 255, 0.88) 50%, rgba(248, 249, 252, 0.96) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Glowing radial highlights ── */}
      <motion.div
        className="absolute left-1/2 top-[28%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          background: isComplete
            ? "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.03) 50%, transparent 70%)"
            : "radial-gradient(circle, rgba(79, 70, 229, 0.11) 0%, rgba(99, 102, 241, 0.03) 50%, transparent 70%)",
        }}
        animate={
          reduced
            ? undefined
            : { scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }
        }
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* ── Main Responsive Container ── */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        {/* ── AI Neural Core Orb ── */}
        <motion.div
          initial={reduced ? false : { scale: 0.8, opacity: 0 }}
          animate={reduced ? false : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease }}
          className="relative flex items-center justify-center mb-6"
        >
          {/* Outermost expanding pulse */}
          <motion.div
            className={`absolute h-[110px] w-[110px] rounded-full border ${isComplete ? "border-emerald-500/25" : "border-primary/20"
              }`}
            animate={
              reduced
                ? undefined
                : { scale: [1, 1.35], opacity: [0.45, 0] }
            }
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeOut",
            }}
            aria-hidden="true"
          />

          {/* Secondary pulse ring */}
          <motion.div
            className={`absolute h-[94px] w-[94px] rounded-full border ${isComplete ? "border-emerald-500/20" : "border-primary/15"
              }`}
            animate={
              reduced
                ? undefined
                : { scale: [1, 1.25], opacity: [0.35, 0] }
            }
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.8,
            }}
            aria-hidden="true"
          />

          {/* Core visual sphere */}
          <motion.div
            className="relative flex h-[70px] w-[70px] items-center justify-center rounded-full shadow-lg"
            style={{
              background: isComplete
                ? "radial-gradient(circle at 35% 35%, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)"
                : "radial-gradient(circle at 35% 35%, rgba(245, 247, 255, 0.98) 0%, rgba(224, 231, 255, 0.9) 45%, rgba(199, 210, 254, 0.6) 80%, rgba(165, 180, 252, 0.4) 100%)",
              boxShadow: isComplete
                ? "0 0 28px rgba(16, 185, 129, 0.25), inset 0 -2px 8px rgba(5, 150, 105, 0.15)"
                : "0 0 28px rgba(79, 70, 229, 0.2), inset 0 -2px 8px rgba(79, 70, 229, 0.12)",
            }}
            animate={reduced ? undefined : { scale: [1, 1.04, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {isComplete ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            ) : (
              <BrainCircuit className="h-8 w-8 text-primary" />
            )}
          </motion.div>
        </motion.div>

        {/* ── Title & Status Headline ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="flex flex-col items-center gap-1.5 text-center mb-6"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase shadow-xs">
            <Sparkles className="size-3" />
            <span>INTERVIEWAI SIMULATION LAB</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            {displayError
              ? "Preparation Error"
              : isComplete
                ? "Interview Ready!"
                : "Synthesizing Custom Interview Plan"}
          </h1>

          <p className="max-w-md text-xs sm:text-sm text-text-secondary leading-relaxed">
            {displayError
              ? "We encountered an issue while parsing your resume or synthesizing questions."
              : isComplete
                ? "All rounds initialized. Entering your live technical interview room..."
                : "Extracting candidate experience, building vector embeddings, and calibrating role rubrics."}
          </p>
        </motion.div>

        {/* ── Context & Metadata Pills + Live Elapsed Time ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease, delay: 0.1 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface/80 px-3.5 py-1 text-xs font-medium text-text shadow-xs backdrop-blur-sm">
            <span className="text-text-muted">Role:</span>
            <span className="font-semibold text-text">{displayRole}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface/80 px-3.5 py-1 text-xs font-medium text-text shadow-xs backdrop-blur-sm">
            <span className="text-text-muted">Difficulty:</span>
            <span className="font-semibold text-text capitalize">{displayDifficulty}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface/80 px-3.5 py-1 text-xs font-medium text-text shadow-xs backdrop-blur-sm max-w-[210px]">
            <span className="text-text-muted">Resume:</span>
            <span className="truncate font-semibold text-text">{displayResumeName}</span>
          </span>

          {!displayError && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs backdrop-blur-sm">
              <Clock className="size-3.5 animate-pulse text-primary" />
              <span>Elapsed: {formattedElapsed}</span>
              <span className="text-primary/60 font-normal">· ~2mins typical</span>
            </span>
          )}
        </motion.div>

        {/* ── Global Animated Progress Bar ── */}
        {!displayError && (
          <div className="w-full max-w-3xl mb-7 px-2">
            <div className="flex items-center justify-between text-xs font-semibold text-text-secondary mb-1.5">
              <span>{isComplete ? "Initialization Complete" : "Pipeline Progress"}</span>
              <span className="font-mono text-primary font-bold">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border/60 overflow-hidden shadow-inner">
              <motion.div
                className={`h-full rounded-full ${isComplete
                  ? "bg-emerald-500"
                  : "bg-gradient-to-r from-primary via-indigo-500 to-cyan-500"
                  }`}
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease }}
              />
            </div>
          </div>
        )}

        {/* ── 2-Column Responsive Workspace Body ── */}
        {!displayError && (
          <div className="grid w-full grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Real-Time Synced Preparation Steps (7 cols) */}
            <motion.div
              initial={reduced ? false : { opacity: 0, x: -12 }}
              animate={reduced ? false : { opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.15 }}
              className="md:col-span-7 flex flex-col rounded-2xl border border-border/80 bg-surface/85 p-6 shadow-card backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3.5 mb-5">
                <div>
                  <h2 className="text-sm font-bold text-text">Simulation Lifecycle</h2>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Autonomous vectorization & state-graph assembly
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-medium text-text-secondary">
                  <ShieldCheck className="size-3 text-emerald-500" />
                  <span>Isolated Sandbox</span>
                </div>
              </div>

              <PreparationStepList
                currentStep={currentStep}
                completedSteps={completedSteps}
              />
            </motion.div>

            {/* Right Column: Dynamic Interview Insights & Tips Carousel (5 cols) */}
            <motion.div
              initial={reduced ? false : { opacity: 0, x: 12 }}
              animate={reduced ? false : { opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.2 }}
              className="md:col-span-5 flex flex-col justify-between rounded-2xl border border-border/80 bg-surface/85 p-6 shadow-card backdrop-blur-md"
            >
              <div>
                {/* Header with Navigation Controls */}
                <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="size-4 text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-text">
                      Candidate Intel
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevTip}
                      aria-label="Previous tip"
                      className="flex size-6 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:text-text hover:bg-surface-elevated transition-colors"
                    >
                      <ChevronLeft className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextTip}
                      aria-label="Next tip"
                      className="flex size-6 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:text-text hover:bg-surface-elevated transition-colors"
                    >
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Animated Tip Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTipIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${activeTip.badgeColor}`}
                      >
                        <activeTip.icon className="size-3" />
                        <span>{activeTip.category}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-text leading-snug">
                      {activeTip.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-text-secondary">
                      {activeTip.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Carousel Dots & Environment Checklist */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-medium text-text-muted">
                    Tip {activeTipIndex + 1} of {tips.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {tips.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveTipIndex(idx)}
                        aria-label={`Jump to tip ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-200 ${activeTipIndex === idx
                          ? "w-5 bg-primary"
                          : "w-1.5 bg-border hover:bg-text-muted/50"
                          }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-surface-elevated/80 border border-border/60 p-2.5 text-[11px] text-text-secondary flex items-center gap-2">
                  <Mic className="size-3.5 text-primary shrink-0" />
                  <span>Microphone & speech recognition will activate upon room entry.</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── Error Banner & Actions ── */}
        <AnimatePresence>
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="mt-6 w-full max-w-xl rounded-2xl border border-red-500/25 bg-red-500/10 p-5 text-left shadow-modal backdrop-blur-md"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-red-700 dark:text-red-300">
                    Failed to Synthesize Interview
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
                  <span>Retry Pipeline</span>
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
