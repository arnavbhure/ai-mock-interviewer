import { useEffect, useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useUserStore } from "@/store/user.store";
import { getDashboardData } from "@/api/dashboard/dashboard.api";
import type { ParsedDashboardData, TrendPoint } from "@/types/dashboard.types";
import {
  DashboardHeader,
  PerformanceTrendCard,
  RecentInterviewsCard,
  PerformanceSummaryCard,
  StartInterviewPanel,
  StatCards,
} from "@/components/dashboard";
import { TextLoop } from "@/components/TextLoop/TextLoop";

export function DashboardPage() {
  const reduced = useReducedMotion();
  const user = useUserStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ParsedDashboardData | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      try {
        setIsLoading(true);
        const result = await getDashboardData();
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadStats();
    return () => {
      mounted = false;
    };
  }, []);

  // Extract user's first name, full name, or fallback
  const displayName =
    user?.name?.trim()?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  const enter = reduced ? false : { opacity: 0, y: 6 };
  const shown = reduced ? false : { opacity: 1, y: 0 };
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const hasInterviews = Boolean(
    (data?.dashboardStats?.totalInterviews ?? 0) > 0 ||
      (data?.interviewStats?.length ?? 0) > 0,
  );

  const latestRole = data?.interviewStats?.[0]?.role;
  const activeCount = data?.dashboardStats?.activeInterviews ?? 0;

  // Derive real performance trend points from completed interviews
  const trendPoints: TrendPoint[] = useMemo(() => {
    if (!data?.interviewStats) return [];
    const completedEvaluated = data.interviewStats
      .filter((i) => i.status.toLowerCase() === "completed" && i.overallScore !== null)
      .slice(0, 8)
      .reverse(); // oldest to newest

    return completedEvaluated.map((item, idx) => ({
      label: `Int ${idx + 1}`,
      score: Math.round((item.overallScore as number) * 10), // normalized to 0-100%
    }));
  }, [data?.interviewStats]);

  const trendAverage = Math.round((data?.dashboardStats?.averageScore ?? 0) * 10);

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.35, ease }}
      >
        <DashboardHeader name={displayName} />
      </motion.div>

      {/* TextLoop — subtle decorative separator that extends behind sidebar */}
      <div
        className="pointer-events-none relative z-[-1] my-6"
        style={{ marginLeft: "calc(-50vw + 50%)" }}
        aria-hidden="true"
      >
        <TextLoop
          text="Interview practice  •  Technical skills  •  Communication  •  Confidence"
          shape="linear"
          speed={40}
          fontSize={12}
          fontWeight={500}
          letterSpacing={0.4}
          uppercase={false}
          pauseOnHover={false}
          className="opacity-50"
        />
      </div>

      {/* ── 1. Top Stat Cards ── */}
      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.35, ease, delay: reduced ? 0 : 0.04 }}
      >
        <StatCards
          stats={data?.dashboardStats}
          isLoading={isLoading}
          className="mt-8 border-t border-border pt-8"
        />
      </motion.div>

      {/* ── 2. Quick Action / Resume Panel ── */}
      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.35, ease, delay: reduced ? 0 : 0.08 }}
      >
        <StartInterviewPanel
          hasData={hasInterviews}
          activeCount={activeCount}
          latestRole={latestRole}
          className="mt-12"
        />
      </motion.div>

      {/* ── 3. Recent Interviews Table + Performance Summary Snapshot ── */}
      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.4, ease, delay: reduced ? 0 : 0.12 }}
      >
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <RecentInterviewsCard
            interviews={data?.interviewStats}
            isLoading={isLoading}
            className="lg:col-span-7"
          />
          <PerformanceSummaryCard
            stats={data?.dashboardStats}
            isLoading={isLoading}
            className="lg:col-span-5"
          />
        </div>

        {/* ── 4. Real Performance Trend (renders if 2 or more evaluated interviews exist) ── */}
        {trendPoints.length >= 2 && (
          <PerformanceTrendCard
            data={trendPoints}
            averageScore={trendAverage}
            isLoading={isLoading}
            className="mt-14 border-t border-border pt-10"
          />
        )}
      </motion.div>
    </div>
  );
}
