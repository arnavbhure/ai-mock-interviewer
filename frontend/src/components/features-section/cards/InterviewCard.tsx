import { useEffect, useState } from "react";
import { BrowserWindow } from "@/components/hero/InterviewHeroDemo/BrowserWindow";
import { QuestionCard } from "@/components/hero/InterviewHeroDemo/QuestionCard";
import { RecordingPanel } from "@/components/hero/InterviewHeroDemo/RecordingPanel";
import { Waveform } from "@/components/hero/InterviewHeroDemo/Waveform";
import { FeatureCard } from "@/components/features-section/FeatureCard";

const interviewQuestions = [
  "How would you design an interview system that adapts based on the candidate's resume?",
  "What tradeoffs would you make between strict evaluation and interview realism?",
  "How do you ensure follow-up questions stay context-aware without feeling scripted?",
];

const waveformFrames = [
  [42, 58, 35, 64, 48, 70, 40, 52],
  [55, 76, 58, 82, 62, 74, 66, 78],
  [36, 44, 30, 48, 38, 60, 34, 46],
];

export function InterviewCard() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [waveformIndex, setWaveformIndex] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setQuestionIndex((current) => (current + 1) % interviewQuestions.length);
      setWaveformIndex((current) => (current + 1) % waveformFrames.length);
    }, 4200);

    return () => window.clearInterval(timerId);
  }, []);

  return (
    <FeatureCard
      index={1}
      eyebrow="Live interview"
      title="Live AI interview"
      description="The interface behaves like an active interview room, with recording, waveform activity, and changing questions."
      className="xl:col-span-5"
    >
      <BrowserWindow>
        <div className="grid gap-4">
          <QuestionCard question={interviewQuestions[questionIndex]} />
          <div className="grid gap-4 rounded-[24px] border border-border/70 bg-card p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex items-center gap-3">
              <span className="relative flex size-3.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-error/30" />
                <span className="relative inline-flex size-3.5 rounded-full bg-error" />
              </span>
              <p className="text-sm font-medium text-foreground">Recording active</p>
            </div>
            <Waveform bars={waveformFrames[waveformIndex]} />
          </div>
          <RecordingPanel bars={waveformFrames[waveformIndex]} timer={`00:0${questionIndex + 1}`} />
        </div>
      </BrowserWindow>
    </FeatureCard>
  );
}
