import { Link } from "react-router-dom";
import logoMark from "@/assets/Logo.png";
import { cn } from "@/lib/utils";

type NavbarLogoProps = {
  /** Shrinks the mark slightly once the page has been scrolled. */
  scrolled?: boolean;
  className?: string;
};

export function NavbarLogo({ scrolled = false, className }: NavbarLogoProps) {
  return (
    <Link
      to="/"
      aria-label="InterviewAI home"
      className={cn(
        "inline-flex shrink-0 items-center rounded-button transition-opacity duration-200 ease-premium hover:opacity-80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <img
        alt="InterviewAI logo"
        src={logoMark}
        className={cn(
          "h-8 w-auto object-contain transition-[height] duration-300 ease-premium md:h-9",
          scrolled && "md:h-8",
        )}
      />
    </Link>
  );
}

