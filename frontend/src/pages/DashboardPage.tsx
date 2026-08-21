import { motion, useReducedMotion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { HAS_INTERVIEWS } from "@/data/dashboard.mock";
import {
  DashboardHeader,
  PerformanceTrendCard,
  RecentInterviewsCard,
  SkillProgressCard,
  StartInterviewPanel,
  StatCards,
} from "@/components/dashboard";

export function DashboardPage() {
  const reduced = useReducedMotion();
  const user = useAuthStore((state) => state.user);
  const displayName =
    user?.name?.trim()?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  const enter = reduced ? false : { opacity: 0, y: 6 };
  const shown = reduced ? false : { opacity: 1, y: 0 };
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.35, ease }}
      >
        <DashboardHeader name={displayName} />
      </motion.div>

      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.35, ease, delay: reduced ? 0 : 0.04 }}
      >
        <StatCards hasData={HAS_INTERVIEWS} className="mt-12 border-t border-border pt-10" />
      </motion.div>

      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.35, ease, delay: reduced ? 0 : 0.08 }}
      >
        <StartInterviewPanel hasData={HAS_INTERVIEWS} className="mt-12" />
      </motion.div>

      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.4, ease, delay: reduced ? 0 : 0.12 }}
      >
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <RecentInterviewsCard hasData={HAS_INTERVIEWS} className="lg:col-span-7" />
          <SkillProgressCard hasData={HAS_INTERVIEWS} className="lg:col-span-5" />
        </div>
        {HAS_INTERVIEWS && (
          <PerformanceTrendCard className="mt-14 border-t border-border pt-10" />
        )}
      </motion.div>
    </div>
  );
}
