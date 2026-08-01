import { useMemo } from "react";
import { DEMO_PHASE_OFFSETS, DEMO_TOTAL_DURATION } from "@/components/hero/constants/DemoTimeline";
import type { HeroPhase } from "@/components/hero/types/hero.types";
import { useDemoLoop } from "@/components/hero/hooks/useDemoLoop";

export function useHeroTimeline(paused = false) {
  const { elapsedMs, seekTo, reset } = useDemoLoop(DEMO_TOTAL_DURATION, paused);

  const phase = useMemo<HeroPhase>(() => {
    if (elapsedMs < DEMO_PHASE_OFFSETS.analysis) {
      return "question";
    }

    if (elapsedMs < DEMO_PHASE_OFFSETS.report) {
      return "analysis";
    }

    return "report";
  }, [elapsedMs]);

  const progress = useMemo(() => elapsedMs / DEMO_TOTAL_DURATION, [elapsedMs]);

  const seekToPhase = (nextPhase: HeroPhase) => {
    seekTo(DEMO_PHASE_OFFSETS[nextPhase]);
  };

  return { phase, progress, elapsedMs, seekToPhase, reset };
}
