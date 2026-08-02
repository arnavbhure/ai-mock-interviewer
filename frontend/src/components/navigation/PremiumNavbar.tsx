import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { NavbarLogo } from "@/components/navigation/NavbarLogo";
import { NavPill } from "@/components/navigation/NavPill";
import { NavbarActions } from "@/components/navigation/NavbarActions";
import { NAV_EASING } from "@/components/navigation/navbar.animations";
import { NAV_ITEMS } from "@/components/navigation/navbar.constants";
import { cn } from "@/lib/utils";

export function PremiumNavbar() {
  const reducedMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const highlightX = useSpring(cursorX, { stiffness: 260, damping: 30, mass: 0.6 });
  const highlightY = useSpring(cursorY, { stiffness: 260, damping: 30, mass: 0.6 });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shellClassName = useMemo(
    () =>
      cn(
        "flex items-center justify-between gap-6 overflow-hidden border px-4 transition-[height,border-radius,box-shadow] duration-500 ease-premium sm:px-6",
        isScrolled
          ? "h-[72px] rounded-[26px] border-navbar-border/80 bg-navbar shadow-navbar backdrop-blur-2xl backdrop-saturate-150"
          : "h-[88px] rounded-[30px] border-transparent bg-transparent shadow-none",
      ),
    [isScrolled],
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    cursorX.set(event.clientX - rect.left);
    cursorY.set(event.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    cursorX.set(-200);
    cursorY.set(-200);
  };

  return (
    <>
      <div aria-hidden="true" className="h-24 md:h-28" />

      <header className="fixed left-0 right-0 top-4 z-50 w-full">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-7 lg:px-10">
          <motion.div
            animate={reducedMotion ? undefined : { scale: isScrolled ? 0.99 : 1 }}
            transition={{ duration: 0.5, ease: NAV_EASING }}
            className={shellClassName}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
            >
              <motion.div
                style={{ x: highlightX, y: highlightY }}
                className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
              />
            </div>

            <NavbarLogo scrolled={isScrolled} />

            <nav aria-label="Primary" className="hidden h-full items-center lg:flex">
              <div className="flex items-center gap-1">
                {NAV_ITEMS.map((item) => (
                  <NavPill key={item.href} item={item} active={item.href === "/login"} />
                ))}
              </div>
            </nav>

            <NavbarActions />
          </motion.div>
        </div>
      </header>
    </>
  );
}

