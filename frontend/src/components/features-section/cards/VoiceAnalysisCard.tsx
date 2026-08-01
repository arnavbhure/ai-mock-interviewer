import { motion } from "framer-motion";
import { FeatureCard } from "@/components/features-section/FeatureCard";

const voiceMeters = [
  { label: "Confidence meter", value: 82 },
  { label: "Speaking pace", value: 68 },
  { label: "Clarity", value: 91 },
];

const voiceBars = [46, 72, 54, 84, 66, 58, 76, 60, 82, 50, 70];

export function VoiceAnalysisCard() {
  return (
    <FeatureCard
      index={3}
      eyebrow="Voice analysis"
      title="Voice & communication analysis"
      description="Track delivery, pacing, and confidence while the system keeps listening for evidence of strong communication."
      className="xl:col-span-5"
    >
      <div className="grid h-full gap-4 sm:grid-cols-[1fr_auto]">
        <div className="rounded-[22px] border border-border/70 bg-background p-4">
          <div className="flex h-28 items-end gap-1.5">
            {voiceBars.map((bar, index) => (
              <motion.span
                key={`${bar}-${index}`}
                animate={{ height: [`${bar}%`, `${bar + 12}%`, `${bar - 6}%`, `${bar}%`] }}
                transition={{ duration: 2.8, repeat: Infinity, delay: index * 0.05 }}
                className="w-1.5 rounded-full bg-primary/80"
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Animated voice bars react to the cadence of the answer.</p>
        </div>

        <div className="flex min-w-[160px] flex-col justify-between gap-3 rounded-[22px] border border-border/70 bg-card p-4">
          {voiceMeters.map((meter, index) => (
            <div key={meter.label}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-foreground">{meter.label}</span>
                <span className="font-mono text-muted-foreground">{meter.value}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${meter.value}%` }}
                  transition={{ duration: 0.45, delay: 0.15 + index * 0.12 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </FeatureCard>
  );
}
