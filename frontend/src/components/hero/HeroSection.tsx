import { useReducedMotion } from "framer-motion";
import heroImage from "@/assets/hero_image.png";
import { HeroContent } from "@/components/hero/HeroContent";

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-[max(100svh,700px)] items-center overflow-hidden bg-background"
    >
      {/* Background environment — the interview-room artwork. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <img src={heroImage} alt="" className="h-full w-full object-cover object-right" />
        {/* Subtle left-side readability gradient only — the right-side composition stays visible */}
        <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-background via-background/45 to-transparent" />
      </div>

      <HeroContent reduceMotion={Boolean(reduceMotion)} />
    </section>
  );
}
