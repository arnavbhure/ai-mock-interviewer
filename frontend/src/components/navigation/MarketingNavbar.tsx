import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { NavbarActions } from "@/components/navigation/NavbarActions";
import { NavbarLogo } from "@/components/navigation/NavbarLogo";
import { NavLinks } from "@/components/navigation/NavLinks";
import { cn } from "@/lib/utils";

export function MarketingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ease-premium",
        isScrolled
          ? "border-border/60 bg-background/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto grid h-16 w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
        {/* Left — brand */}
        <div className="col-start-1 flex items-center justify-start">
          <NavbarLogo scrolled={isScrolled} />
        </div>

        {/* Center — marketing links (tablet/desktop) */}
        <div className="col-start-2 hidden md:block">
          <NavLinks />
        </div>

        {/* Right — actions */}
        <div className="col-start-3 flex items-center justify-end gap-2 sm:gap-3">
          <div className="hidden md:block">
            <NavbarActions />
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={isMobileMenuOpen}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-button text-text-secondary",
              "transition-colors duration-200 ease-premium hover:text-text",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "md:hidden",
            )}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onRequestClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}