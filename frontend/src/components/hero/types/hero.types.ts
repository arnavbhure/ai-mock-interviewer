export type HeroPhase = "question" | "analysis" | "report";

export type HeroStat = {
  value: string;
  label: string;
};

export type HeroAction = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

export type SkillProgress = {
  label: string;
  value: number;
};
