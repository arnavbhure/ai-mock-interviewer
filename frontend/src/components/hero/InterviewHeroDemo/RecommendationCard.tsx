type RecommendationCardProps = {
  recommendation: string;
  subtitle: string;
};

export function RecommendationCard({ recommendation, subtitle }: RecommendationCardProps) {
  return (
    <div className="rounded-[24px] border border-border/70 bg-card p-5 shadow-card">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Recommendation</p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-foreground">{recommendation}</p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{subtitle}</p>
    </div>
  );
}
