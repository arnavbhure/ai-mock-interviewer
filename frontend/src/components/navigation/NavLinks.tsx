import { ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MARKETING_NAV_LINKS } from "@/components/navigation/navbar.constants";
import { scrollToSection } from "@/components/navigation/navbar.utils";
import { cn } from "@/lib/utils";

type NavLinksProps = {
  /** Called after a link is activated (used to close the mobile menu). */
  onNavigate?: () => void;
  /** Renders the links as a full-width vertical stack for the mobile menu. */
  mobile?: boolean;
};

export function NavLinks({ onNavigate, mobile = false }: NavLinksProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();

    // Section exists on this page: scroll to it. Otherwise fall back to the marketing page.
    if (!scrollToSection(id) && pathname !== "/") {
      navigate("/");
    }
    onNavigate?.();
  };

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "flex",
        mobile ? "flex-col" : "items-center justify-center gap-7 lg:gap-10",
      )}
    >
      {MARKETING_NAV_LINKS.map((link) => (
        <a
          key={link.id}
          href={link.id === "dashboard" ? "/dashboard" : `#${link.id}`}
          onClick={(event) => handleClick(event, link.id)}
          className={cn(
            "relative text-sm font-medium tracking-[-0.01em] text-text-secondary",
            "transition-colors duration-200 ease-premium hover:text-text",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            mobile
              ? "flex items-center justify-between rounded-button px-3 py-3 text-[0.9375rem] text-text hover:bg-surface"
              : "after:pointer-events-none after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-text/70 after:content-[''] after:transition-transform after:duration-300 after:ease-premium hover:after:scale-x-100",
          )}
        >
          <span>{link.label}</span>
          {mobile ? (
            <ArrowRight
              className="h-4 w-4 text-text-muted"
              aria-hidden="true"
            />
          ) : null}
        </a>
      ))}
    </nav>
  );
}
