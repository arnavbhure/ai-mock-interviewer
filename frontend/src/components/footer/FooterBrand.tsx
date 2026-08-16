import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import logoMark from "@/public/Logo.png";
import { FooterSocial } from "@/components/footer/FooterSocial";

export function FooterBrand() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="max-w-xl">
      <motion.div
        whileHover={reducedMotion ? undefined : { y: -1 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          to="/"
          aria-label="InterviewAI home"
          className="inline-flex items-center"
        >
          <img
            alt="InterviewAI logo"
            className="h-12 w-auto object-contain sm:h-14"
            src={logoMark}
          />
        </Link>
      </motion.div>

      <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
        Practice real interviews with AI, improve faster, and land your dream
        job.
      </p>

      <div className="mt-6">
        <FooterSocial />
      </div>
    </div>
  );
}
