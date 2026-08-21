import * as Tooltip from "@radix-ui/react-tooltip";
import { NavLink } from "react-router-dom";
import {
  Briefcase,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Settings,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarTooltip } from "./SidebarTooltip";

type SidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

const PRIMARY_NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/interviews", label: "Interviews", icon: Briefcase },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/progress", label: "Progress", icon: TrendingUp },
] as const;

const UTILITY_NAV = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help", icon: HelpCircle },
] as const;

function BrandMark() {
  return (
    <span
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-primary text-primary-foreground"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden="true">
        <rect x="5" y="11" width="2.4" height="7" rx="1.2" fill="currentColor" />
        <rect x="8.4" y="8.5" width="2.4" height="9.5" rx="1.2" fill="currentColor" />
        <rect x="11.8" y="6" width="2.4" height="12" rx="1.2" fill="currentColor" />
        <rect x="15.2" y="8.5" width="2.4" height="9.5" rx="1.2" fill="currentColor" />
        <rect x="18.6" y="11" width="2.4" height="7" rx="1.2" fill="currentColor" />
      </svg>
    </span>
  );
}

/** Labels inside nav links slide and fade out when the rail collapses. */
function NavLabel({
  show,
  className,
  children,
}: {
  show: boolean;
  className?: string;
  children: string;
}) {
  return (
    <span
      className={cn(
        "min-w-0 overflow-hidden whitespace-nowrap",
        "transition-opacity duration-200 ease-out",
        show ? "flex-1 opacity-100" : "w-0 opacity-0",
        className,
      )}
      aria-hidden={show ? undefined : true}
    >
      <span className={cn("truncate", show && "transition-[transform] duration-200 ease-out")}>
        {children}
      </span>
    </span>
  );
}

export function Sidebar({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const name = user?.name?.trim() || "Candidate";
  const cleanName = name;
  const initials = cleanName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  // The mobile drawer always shows the expanded rail.
  const showExpanded = mobileOpen || !collapsed;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onCloseMobile}
        className={cn(
          "fixed inset-0 z-40 bg-[#111827]/40 backdrop-blur-[2px] transition-opacity duration-300 ease-premium lg:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      />
      <Tooltip.Provider delayDuration={250} skipDelayDuration={150}>
        <aside
          aria-label="App navigation"
          className={cn(
            "flex flex-col overflow-y-auto border-r border-border bg-surface",
            // Mobile: off-canvas drawer
            "fixed top-0 bottom-0 left-0 z-50 w-[240px]",
            "transition-[width,transform] duration-300 ease-premium",
            "shadow-[0_1px_3px_rgba(16,24,40,0.08),0_8px_24px_rgba(16,24,40,0.12)] lg:shadow-none",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            // Desktop: in-flow, sticky, retractable width
            "lg:h-dvh lg:sticky lg:top-0",
            collapsed ? "lg:w-[72px]" : "lg:w-[240px]",
          )}
        >
          {/* Brand */}
          <div className="flex h-16 shrink-0 items-center border-b border-border">
            <NavLink
              to="/dashboard"
              onClick={onCloseMobile}
              aria-label="InterviewAI dashboard"
              className={cn(
                "flex h-full min-w-0 flex-1 items-center",
                showExpanded ? "gap-3 px-5" : "justify-center px-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <BrandMark />
              <NavLabel
                show={showExpanded}
                className="text-[15px] font-semibold tracking-tight text-text"
              >
                InterviewAI
              </NavLabel>
            </NavLink>
            <button
              type="button"
              onClick={onCloseMobile}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-text-muted lg:hidden transition-colors duration-base ease-premium hover:bg-surface-elevated hover:text-text"
              aria-label="Close menu"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          {/* Primary navigation */}
          <nav aria-label="Primary" className="flex flex-col gap-1 px-3 pt-5">
            {PRIMARY_NAV.map((item) => (
              <SidebarNavItem
                key={item.to}
                {...item}
                collapsed={!showExpanded}
                onClick={onCloseMobile}
              />
            ))}
          </nav>

          {/* Separator before the secondary / foot cluster */}
          <div aria-hidden="true" className="mx-3 my-4 h-[1px] bg-border" />

          <div className="mt-auto flex flex-col px-3">
            {UTILITY_NAV.map((item) => (
              <SidebarNavItem
                key={item.to}
                {...item}
                collapsed={!showExpanded}
                onClick={onCloseMobile}
              />
            ))}
          </div>

          {/* User profile */}
          <div className="border-t border-border px-2 pt-1 pb-2">
            <SidebarTooltip label={cleanName} disabled={showExpanded}>
              <NavLink
                to="/settings"
                onClick={onCloseMobile}
                aria-label={`Profile · ${cleanName}`}
                className={cn(
                  "flex h-12 min-w-0 items-center rounded-lg",
                  showExpanded ? "gap-3 px-3" : "justify-center px-0",
                  "transition-colors duration-base ease-premium hover:bg-surface-elevated",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-full",
                    "bg-primary/10 text-sm font-semibold text-primary",
                  )}
                >
                  {initials || <User className="size-4" aria-hidden="true" />}
                </span>
                <span
                  className={cn(
                    "min-w-0 overflow-hidden whitespace-nowrap transition-opacity duration-200 ease-out",
                    showExpanded ? "flex-1 opacity-100" : "w-0 opacity-0",
                  )}
                  aria-hidden={!showExpanded}
                >
                  <span className="flex flex-col items-start w-full">
                    <span className="truncate text-sm font-medium text-text">{cleanName}</span>
                    <span className="truncate text-xs text-text-muted">Candidate</span>
                  </span>
                </span>
              </NavLink>
            </SidebarTooltip>

            {/* Collapse control — belongs to the sidebar */}
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              className={cn(
                "flex h-9 min-w-0 items-center rounded-lg transition-colors duration-base ease-premium hidden lg:flex",
                showExpanded ? "gap-3 px-3" : "justify-center px-0",
                "text-text-muted hover:bg-surface-elevated hover:text-text",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              {collapsed ? (
                <ChevronsRight className="size-4 shrink-0" aria-hidden="true" />
              ) : (
                <>
                  <ChevronsLeft className="size-4 shrink-0" aria-hidden="true" />
                  <span className="text-xs font-medium">Collapse</span>
                </>
              )}
            </button>
          </div>
        </aside>
      </Tooltip.Provider>
    </>
  );
}