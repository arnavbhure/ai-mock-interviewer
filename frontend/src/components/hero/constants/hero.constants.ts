import type { HeroAction, HeroStat, SkillProgress } from "@/components/hero/types/hero.types";

export const HERO_STATS: HeroStat[] = [
  { value: "50K+", label: "Mock Interviews" },
  { value: "95%", label: "Candidate Satisfaction" },
  { value: "250+", label: "Interview Questions" },
];

export const HERO_ACTIONS: HeroAction[] = [
  { label: "Start Free Interview", href: "/register", variant: "primary" },
  { label: "Watch Live Demo", href: "#demo", variant: "secondary" },
];

export const DEMO_QUESTION =
  "Walk me through how you would design a resume-driven interview flow that adapts to candidate answers.";

export const DEMO_TRANSCRIPT = [
  "Hi, welcome to InterviewAI.",
  "Let's start with your most relevant project and why you chose that architecture.",
  "I want to understand the tradeoffs behind your decisions, not just the implementation.",
  "Please think aloud while you answer.",
];

export const DEMO_SKILLS: SkillProgress[] = [
  { label: "Technical Depth", value: 91 },
  { label: "Communication", value: 87 },
  { label: "Problem Solving", value: 94 },
];

export const HERO_ANNOUNCEMENT = "Personalized mock interviews from resume to report";
