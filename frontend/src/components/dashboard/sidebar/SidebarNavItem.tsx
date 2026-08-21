import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarTooltip } from "./SidebarTooltip";

type SidebarNavItemProps = {
  to: string;
  label: string;
  icon: LucideIcon;
  collapsed: boolean;
  onClick?: () => void;
};

export function SidebarNavItem({ to, label, icon: Icon, collapsed, onClick }: SidebarNavItemProps) {
  return (
    <SidebarTooltip label={label} disabled={!collapsed}>
      <NavLink
        to={to}
        onClick={onClick}
        aria-label={label}
        className={({ isActive }) =>
          cn(
            "group relative flex h-10 min-w-0 items-center rounded-lg",
            collapsed ? "justify-center px-0" : "gap-3 px-3",
            "transition-colors duration-base ease-premium",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isActive
              ? "bg-primary/10 font-semibold text-primary"
              : "text-text-secondary hover:bg-surface-elevated hover:text-text",
          )
        }
        end={to === "/dashboard"}
      >
        <Icon
          className={cn("size-[18px] shrink-0", collapsed ? "" : "group-hover:scale-105")}
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <span
          className={cn(
            "min-w-0 overflow-hidden whitespace-nowrap transition-opacity duration-200 ease-out",
            collapsed ? "w-0 opacity-0" : "flex-1 opacity-100",
          )}
          aria-hidden={collapsed ? true : undefined}
        >
          <span className="block truncate">{label}</span>
        </span>
      </NavLink>
    </SidebarTooltip>
  );
}