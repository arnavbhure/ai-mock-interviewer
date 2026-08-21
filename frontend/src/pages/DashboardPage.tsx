import { motion, useReducedMotion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { HAS_INTERVIEWS } from "@/data/dashboard.mock";
import { TextLoop } from "@/components/TextLoop/TextLoop";
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

  const enter = reduced ? false : { opacity: 0, y: 8 };
  const shown = reduced ? false : { opacity: 1, y: 0 };
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.4, ease }}
      >
        <DashboardHeader name={displayName} />
      </motion.div>

      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.4, ease, delay: reduced ? 0 : 0.07 }}
      >
        <TextLoop
          text="INTERVIEW PRACTICE ✦ TECHNICAL SKILLS ✦ CONFIDENCE ✦ COMMUNICATION"
          shape="wave"
          speed={32}
          fontSize={13}
          fontWeight={600}
          letterSpacing={1.5}
          uppercase
          pauseOnHover
          className="mt-6"
        />
      </motion.div>

      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.4, ease, delay: reduced ? 0 : 0.05 }}
      >
        <StartInterviewPanel hasData={HAS_INTERVIEWS} className="mt-8" />
      </motion.div>

      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.4, ease, delay: reduced ? 0 : 0.1 }}
      >
        <StatCards hasData={HAS_INTERVIEWS} className="mt-8" />
      </motion.div>

      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.45, ease, delay: reduced ? 0 : 0.15 }}
      >
        <div className="mt-8 grid gap-5 lg:grid-cols-12">
          <RecentInterviewsCard hasData={HAS_INTERVIEWS} className="lg:col-span-7" />
          <SkillProgressCard hasData={HAS_INTERVIEWS} className="lg:col-span-5" />
        </div>
        {HAS_INTERVIEWS && <PerformanceTrendCard className="mt-5" />}
      </motion.div>
    </div>
  );
}