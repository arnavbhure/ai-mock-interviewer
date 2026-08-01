import type { HeroPhase } from "@/components/hero/types/hero.types";

export const DEMO_PHASE_ORDER: HeroPhase[] = ["question", "analysis", "report"];

export const DEMO_PHASE_OFFSETS: Record<HeroPhase, number> = {
  question: 0,
  analysis: 7000,
  report: 12000,
};

export const DEMO_TOTAL_DURATION = 19000;
