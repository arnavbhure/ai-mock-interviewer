import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import logoMark from "@/assets/Logo.png";
import { NAV_EASING, logoVariants } from "@/components/navigation/navbar.animations";

type NavbarLogoProps = {
  scrolled: boolean;
};

export function NavbarLogo({ scrolled }: NavbarLogoProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex items-center pl-1">
      <motion.div
        whileHover={reducedMotion ? undefined : "hover"}
        initial="rest"
        animate="rest"
        variants={logoVariants}
        transition={{ duration: 0.28, ease: NAV_EASING }}
      >
        <Link
          to="/"
          aria-label="InterviewAI home"
          className="group flex items-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <motion.img
            alt="InterviewAI logo"
            animate={reducedMotion ? undefined : { scale: scrolled ? 0.94 : 1 }}
            transition={{ duration: 0.35, ease: NAV_EASING }}
            className="h-[86px] w-auto object-contain sm:h-[92px]"
            src={logoMark}
          />
        </Link>
      </motion.div>
    </div>
  );
}

