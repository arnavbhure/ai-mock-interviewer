import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BrainCircuit, AlertTriangle, ArrowLeft, RotateCcw, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShinyText } from "@/components/ShinyText/ShinyText";
import { Button } from "@/components/ui/button";
import { useInterviewStore } from "@/store/interview.store";
import { emitStartInterview } from "@/services/interviewSocket.service";
import dashboardBg from "@/assets/background_image_dashboard.png";

type Props = {
  preparationError?: string | null;
  role?: string;
  difficulty?: string | null;
};

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function PreparationScreen({
  preparationError,
  role = "Full Stack Developer",
  difficulty = "Medium",
}: Props) {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  const storeError = useInterviewStore((s) => s.error);
  const storeDifficulty = useInterviewStore((s) => s.difficulty);
  const displayError = preparationError || storeError?.message;
  const displayDifficulty = storeDifficulty || difficulty;

  const handleRetry = () => {
    emitStartInterview();
  };

  const handleBackToDashboard = () => {
    useInterviewStore.getState().resetInterview();
    navigate("/dashboard/new");
  };

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
            {displayError ? "Interview Setup Error" : "Preparing your interview"}
          </h1>
          <p className="max-w-xs text-center text-sm leading-relaxed text-text-secondary">
            {displayError
              ? "We encountered an issue starting your interview session."
              : "Connecting to AI interviewer & setting up your personalized session."}
          </p>
        </motion.div>

        {/* ── Loading Status Card ──────────────────────────── */}
        {!displayError && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={reduced ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.25 }}
            className="mt-8 w-full rounded-2xl border border-border/60 bg-surface/70 p-6 shadow-card backdrop-blur-sm flex flex-col items-center text-center gap-3"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Awaiting first question from interviewer...</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
              Your customized interview is being synthesized based on your profile and target role.
            </p>
          </motion.div>
        )}

        {/* ── Context Metadata Pills ───────────────────────── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.35 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border/50 bg-surface/60 px-3 py-1 text-[11px] backdrop-blur-sm">
            <span className="font-medium text-text-muted">Role</span>
            <span className="text-text-secondary">{role}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border/50 bg-surface/60 px-3 py-1 text-[11px] backdrop-blur-sm">
            <span className="font-medium text-text-muted">Difficulty</span>
            <span className="text-text-secondary capitalize">{displayDifficulty}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border/50 bg-surface/60 px-3 py-1 text-[11px] backdrop-blur-sm">
            <span className="font-medium text-text-muted">Type</span>
            <span className="text-text-secondary">Technical</span>
          </span>
        </motion.div>

        {/* ── Error Banner & Actions ───────────────────────── */}
        <AnimatePresence>
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-8 w-full rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-left"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                    {storeError?.code ? `[${storeError.code}] ` : ""}Backend Error
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-red-600 dark:text-red-200 break-words">
                    {displayError}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3 border-t border-red-500/20 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleBackToDashboard}
                  className="h-8 gap-1.5 text-xs"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to setup</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleRetry}
                  className="h-8 gap-1.5 bg-red-600 text-white hover:bg-red-500 text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Retry Start</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

