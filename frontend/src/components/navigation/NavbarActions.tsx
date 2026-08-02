import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { NAV_EASING, ctaArrowVariants } from "@/components/navigation/navbar.animations";
import { MobileNavSheet } from "@/components/navigation/MobileNavSheet";

export function NavbarActions() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex h-full items-center gap-2 sm:gap-3">
      <div className="hidden items-center gap-2 md:flex">
        <ThemeToggle />

        <Button asChild variant="ghost" className="h-12 px-4 text-sm font-medium">
          <Link to="/login">Login</Link>
        </Button>

        <motion.div
          whileHover={reducedMotion ? undefined : "hover"}
          initial="rest"
          whileTap={reducedMotion ? undefined : "tap"}
          animate="rest"
          variants={{ rest: { y: 0 }, hover: { y: -2 }, tap: { y: 0 } }}
          transition={{ duration: 0.28, ease: NAV_EASING }}
        >
          <Button
            asChild
            variant="primary"
            className="h-12 gap-2 px-5 text-sm font-medium shadow-card transition-shadow duration-250 ease-premium hover:shadow-hover"
          >
            <Link to="/register">
              <span>Start Free Interview</span>
              <motion.span
                aria-hidden="true"
                variants={ctaArrowVariants}
                transition={{ duration: 0.28, ease: NAV_EASING }}
                className="inline-flex"
              >
                <ArrowRight size={16} strokeWidth={1.75} />
              </motion.span>
            </Link>
          </Button>
        </motion.div>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        <MobileNavSheet />
      </div>
    </div>
  );
}

