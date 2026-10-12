import { motion, useReducedMotion } from "framer-motion";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { NavbarActions } from "@/components/navigation/NavbarActions";
import { NavbarLogo } from "@/components/navigation/NavbarLogo";
import { NavLinks } from "@/components/navigation/NavLinks";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/user.store";
import { getUserProfile } from "@/api/auth/auth.api";

const NAVBAR_HEIGHT = "4rem"; // h-16
const SCROLL_THRESHOLD = 8;

export function MarketingNavbar() {
  const reduced = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isInitialized = useUserStore((state) => state.isInitialized);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    if (!isInitialized) {
      getUserProfile({ skipErrorToast: true })
        .then((res) => {
          if (res?.success && res?.user && res?.user?.is_verified) {
            setUser(res.user);
          } else {
            clearUser();
          }
        })
        .catch(() => {
          clearUser();
        });
    }
  }, [isInitialized, setUser, clearUser]);

  useEffect(() => {
    let animationFrame: number;
    const onScroll = () => {
      if (!animationFrame) {
        animationFrame = requestAnimationFrame(() => setIsScrolled(window.scrollY > SCROLL_THRESHOLD));
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "transition-[background-color,border-color,box-shadow] duration-500 ease-premium",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
          : "bg-transparent",
      )}
      style={{ height: NAVBAR_HEIGHT }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand — always visible */}
        <div className="flex shrink-0 items-center">
          <NavbarLogo scrolled={isScrolled} />
        </div>

        {/* Desktop: Center navigation links */}
        <nav aria-label="Primary" className="hidden md:block">
          <NavLinks />
        </nav>

        {/* Right side — actions (desktop) + mobile trigger */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <NavbarActions />
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={isMobileMenuOpen}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-button text-text-secondary",
              "transition-[background-color,color,box-shadow] duration-200 ease-premium",
              "hover:bg-surface-elevated hover:text-text",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "md:hidden",
            )}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onRequestClose={() => setIsMobileMenuOpen(false)} />
    </motion.header>
  );
}
