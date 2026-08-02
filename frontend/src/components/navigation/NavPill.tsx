import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { NAV_EASING } from "@/components/navigation/navbar.animations";
import type { NavItem } from "@/components/navigation/navbar.constants";
import { cn } from "@/lib/utils";

type NavPillProps = {
  item: NavItem;
  active?: boolean;
  children?: ReactNode;
  onClick?: () => void;
  mobile?: boolean;
};

export function NavPill({ item, active = false, children, onClick, mobile = false }: NavPillProps) {
  const reducedMotion = useReducedMotion();
  const isActive = active || Boolean(item.active);

  return (
    <motion.a
      href={item.href}
      onClick={onClick}
      whileHover={reducedMotion ? undefined : { y: -1 }}
      whileTap={reducedMotion ? undefined : { y: 0 }}
      transition={{ duration: 0.2, ease: NAV_EASING }}
      className={cn(
        "relative inline-flex items-center rounded-full text-sm font-medium transition-colors duration-250 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "hover:bg-foreground/5 hover:text-foreground",
        isActive ? "text-primary" : "text-muted-foreground",
        mobile
          ? "w-full justify-between px-4 py-3 text-base hover:bg-accent"
          : "px-4 py-2",
      )}
    >
      {isActive && !mobile ? (
        <motion.span
          layoutId="nav-active-pill"
          aria-hidden="true"
          transition={{ duration: 0.28, ease: NAV_EASING }}
          className="absolute inset-0 rounded-full border border-primary/15 bg-primary/10"
        />
      ) : null}

      <span className={cn("relative z-10", isActive ? "font-medium" : "")}>{item.label}</span>

      {mobile ? (
        <ArrowRight size={16} strokeWidth={1.75} className="text-muted-foreground" />
      ) : null}

      {children}
    </motion.a>
  );
}

