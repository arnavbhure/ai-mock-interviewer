import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import heroImage from "@/assets/hero_image.png";

type HeroScrollSceneProps = {
  reducedMotion: boolean;
  children: ReactNode;
};

/**
 * A single continuous cinematic Hero scene.
 *
 * The hero artwork stays completely static (scale 1, no zoom, no parallax,
 * no darkening) while the single copy of the Hero content rises and fades
 * out exactly once as the user scrolls through a 155vh scroll lane.
 */
export function HeroScrollScene({ reducedMotion, children }: HeroScrollSceneProps) {
  return reducedMotion ? (
    <StaticHeroScene>{children}</StaticHeroScene>
  ) : (
    <AnimatedHeroScene>{children}</AnimatedHeroScene>
  );
}

/** Approved static Hero — used when prefers-reduced-motion is active. */
function StaticHeroScene({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-[max(100svh,700px)] items-center overflow-hidden bg-background">
      <HeroBackdrop />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}

/** Hero scene whose content exit is driven by scroll progress. */
function AnimatedHeroScene({ children }: { children: ReactNode }) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  // One scroll progress value for the entire scene.
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  // The content gently rises and fades exactly once, then stays gone.
  // ~0.5 → opacity ~0.7 / translateY ~-20px · ~0.75 → opacity ~0.25 / translateY ~-45px ·
  // ~0.9 → opacity 0 / translateY ~-70px
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.5, 0.75, 0.9, 1],
    isMobile ? [0, -12, -26, -36, -36] : [0, -20, -45, -70, -70],
  );
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 0.75, 0.9, 1], [1, 0.7, 0.25, 0, 0]);

  return (
    <div ref={sceneRef} className="relative h-[155vh]">
      <div className="sticky top-0 flex min-h-[max(100svh,700px)] items-center overflow-hidden">
        {/* Static environment — stable at scale 1. */}
        <HeroBackdrop />

        {/* The single Hero content instance — moves upward, fades out once. */}
        <motion.div
          className="relative z-10 w-full"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

/** The approved hero artwork plus the subtle left readability gradient only. */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <img src={heroImage} alt="" className="h-full w-full object-cover object-right" />
      <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-background via-background/45 to-transparent" />
    </div>
  );
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}