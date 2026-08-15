import { useReducedMotion } from "framer-motion";
import { HeroContent } from "@/components/hero/HeroContent";
import { HeroScrollScene } from "@/components/hero/HeroScrollScene";

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="hero" className="relative bg-background">
      <HeroScrollScene reducedMotion={Boolean(reduceMotion)}>
        <HeroContent reduceMotion={Boolean(reduceMotion)} />
      </HeroScrollScene>
    </section>
  );
}
