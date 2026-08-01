import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { AnalysisPanel } from "@/components/hero/InterviewHeroDemo/AnalysisPanel";
import { BrowserWindow } from "@/components/hero/InterviewHeroDemo/BrowserWindow";
import { QuestionCard } from "@/components/hero/InterviewHeroDemo/QuestionCard";
import { RecordingPanel } from "@/components/hero/InterviewHeroDemo/RecordingPanel";
import { ReportPanel } from "@/components/hero/InterviewHeroDemo/ReportPanel";
import { TranscriptPanel } from "@/components/hero/InterviewHeroDemo/TranscriptPanel";
import { DEMO_QUESTION, DEMO_SKILLS, DEMO_TRANSCRIPT } from "@/components/hero/constants/hero.constants";
import { DEMO_TOTAL_DURATION } from "@/components/hero/constants/DemoTimeline";
import { useHeroTimeline } from "@/components/hero/hooks/useHeroTimeline";
import { useTypingAnimation } from "@/components/hero/hooks/useTypingAnimation";
import { useWaveform } from "@/components/hero/hooks/useWaveform";
import { clamp, formatElapsedTime } from "@/components/hero/utils/animation";

export function InterviewHeroDemo() {
  const reduceMotion = useReducedMotion();
  const [windowPaused, setWindowPaused] = useState(false);
  const [transcriptPaused, setTranscriptPaused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { phase, elapsedMs, seekToPhase } = useHeroTimeline(windowPaused);

  const typedTranscript = useTypingAnimation({
    text: DEMO_TRANSCRIPT.join(" "),
    active: phase === "question",
    paused: transcriptPaused || windowPaused,
    speedMs: 18,
  });

  const waveform = useWaveform(phase === "question", windowPaused);

  const parallaxStyle = useMemo(
    () => ({
      transform: reduceMotion
        ? "none"
        : `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`,
    }),
    [mousePosition.x, mousePosition.y, reduceMotion],
  );

  const reportProgress = phase === "analysis" ? 58 : 100;
  const score = phase === "question" ? 0 : 91;
  const currentTime = formatElapsedTime(elapsedMs);

  return (
    <motion.div
      className="relative"
      style={parallaxStyle}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = clamp((event.clientX - rect.left - rect.width / 2) / 120, -8, 8);
        const y = clamp((event.clientY - rect.top - rect.height / 2) / 120, -8, 8);
        setMousePosition({ x, y });
      }}
    >
      <BrowserWindow onMouseEnter={() => setWindowPaused(true)} onMouseLeave={() => setWindowPaused(false)}>
        <div className="grid gap-4">
          <AnimatePresence mode="wait">
            {phase === "question" ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <QuestionCard question={DEMO_QUESTION} />
                <RecordingPanel bars={waveform} timer={currentTime} />
                <TranscriptPanel
                  text={typedTranscript.displayedText}
                  paused={transcriptPaused || windowPaused}
                  onMouseEnter={() => setTranscriptPaused(true)}
                  onMouseLeave={() => setTranscriptPaused(false)}
                />
              </motion.div>
            ) : null}

            {phase === "analysis" ? (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <AnalysisPanel progress={reportProgress} />
              </motion.div>
            ) : null}

            {phase === "report" ? (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <ReportPanel score={score} skills={DEMO_SKILLS} onViewFullReport={() => seekToPhase("report")} />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            <span>Live interview</span>
            <span>{Math.round((elapsedMs / DEMO_TOTAL_DURATION) * 100)}%</span>
          </div>
        </div>
      </BrowserWindow>
    </motion.div>
  );
}
