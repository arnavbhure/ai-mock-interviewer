import { motion, useReducedMotion } from "framer-motion";
import { useUserStore } from "@/store/user.store";
import { HAS_INTERVIEWS } from "@/data/dashboard.mock";
import {
  DashboardHeader,
  PerformanceTrendCard,
  RecentInterviewsCard,
  SkillProgressCard,
  StartInterviewPanel,
  StatCards,
} from "@/components/dashboard";
import { TextLoop } from "@/components/TextLoop/TextLoop";

export function DashboardPage() {
  const reduced = useReducedMotion();
  const user = useUserStore((state) => state.user);

  // Extract user's first name, full name, or fallback
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

      <motion.div
        initial={enter}
        animate={shown}
        transition={{ duration: 0.35, ease, delay: reduced ? 0 : 0.04 }}
      >
        <StatCards
          hasData={HAS_INTERVIEWS}
          className="mt-8 border-t border-border pt-8"
        />
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
          <RecentInterviewsCard
            hasData={HAS_INTERVIEWS}
            className="lg:col-span-7"
          />
          <SkillProgressCard
            hasData={HAS_INTERVIEWS}
            className="lg:col-span-5"
          />
        </div>
        {HAS_INTERVIEWS && (
          <PerformanceTrendCard className="mt-14 border-t border-border pt-10" />
        )}
      </motion.div>
    </div>
  );
}
