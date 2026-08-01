import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { FeatureCard } from "@/components/features-section/FeatureCard";

const analyticsData = [
  { week: "W1", score: 68 },
  { week: "W2", score: 72 },
  { week: "W3", score: 78 },
  { week: "W4", score: 81 },
  { week: "W5", score: 86 },
  { week: "W6", score: 90 },
];

const history = ["3 interviews this week", "7-day streak", "92% completion rate"];

export function AnalyticsCard() {
  return (
    <FeatureCard
      index={6}
      eyebrow="Interview analytics"
      title="Interview analytics"
      description="Track weekly growth, interview history, and streaks so the candidate can see measurable progress over time."
      className="xl:col-span-8"
    >
      <div className="grid h-full gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[22px] border border-border/70 bg-background p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Weekly improvement</p>
            <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">+22 pts</span>
          </div>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 12" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <Tooltip
                  cursor={{ stroke: "var(--primary)", strokeOpacity: 0.14 }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                    color: "var(--foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fill="url(#analyticsArea)"
                  dot={{ r: 3.5, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 2 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between rounded-[22px] border border-border/70 bg-card p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">History</p>
            <div className="mt-4 space-y-3">
              {history.map((item) => (
                <div key={item} className="rounded-[18px] border border-border/70 bg-background px-3 py-3 text-sm text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[18px] border border-primary/15 bg-primary/8 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Completion streak</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground">12 days</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Consistent practice compounds quickly when the workflow is clear.</p>
          </div>
        </div>
      </div>
    </FeatureCard>
  );
}
