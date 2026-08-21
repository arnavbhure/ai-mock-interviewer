"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import {
  Briefcase,
  ChevronsLeft,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Settings,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
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

const SECONDARY_NAV = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help", icon: HelpCircle },
] as const;

function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("shrink-0 text-text", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 22V12.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M12.5 22V8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M18 22V11"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M23.5 22V15"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const name = user?.name?.trim() || "Candidate";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const showLabels = mobileOpen || !collapsed;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onCloseMobile}
        className={cn(
          "fixed inset-0 z-40 bg-[#111827]/40 backdrop-blur-[2px] lg:hidden",
          "transition-opacity duration-300 ease-premium motion-reduce:transition-none",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      />

      <Tooltip.Provider delayDuration={250} skipDelayDuration={150}>
        <aside
          aria-label="App navigation"
          data-collapsed={collapsed ? "true" : "false"}
          className={cn(
            "flex shrink-0 flex-col overflow-hidden border-r border-border bg-surface",
            "fixed inset-y-0 left-0 z-50 w-[260px]",
            "transition-[width,transform] duration-300 ease-premium motion-reduce:transition-none",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
            "lg:static lg:z-[10] lg:h-dvh lg:translate-x-0 lg:sticky lg:top-0",
            collapsed ? "lg:w-[72px]" : "lg:w-[260px]",
          )}
        >
          <div
            className={cn(
              "flex h-16 shrink-0 items-center",
              showLabels ? "px-4" : "px-0 justify-center",
            )}
          >
            <NavLink
              to="/dashboard"
              onClick={onCloseMobile}
              aria-label="InterviewAI dashboard"
              className={cn(
                "flex min-w-0 items-center rounded-lg",
                showLabels ? "gap-3 flex-1" : "size-10 justify-center",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <BrandMark className="size-8" />
              <span
                className={cn(
                  "min-w-0 overflow-hidden whitespace-nowrap",
                  "text-[17px] font-bold tracking-tight text-text",
                  "transition-opacity duration-200 ease-premium motion-reduce:transition-none",
                  showLabels ? "opacity-100" : "w-0 opacity-0",
                )}
              >
                InterviewAI
              </span>
            </NavLink>

            <button
              type="button"
              onClick={onCloseMobile}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-text-muted lg:hidden hover:bg-background-secondary hover:text-text"
              aria-label="Close menu"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Primary"
            className={cn("flex flex-col gap-0.5 pt-2", showLabels ? "px-3" : "px-0")}
          >
            {PRIMARY_NAV.map((item) => (
              <SidebarNavItem
                key={item.to}
                {...item}
                collapsed={!showLabels}
                onClick={onCloseMobile}
              />
            ))}
          </nav>

          <div className="mt-auto flex flex-col pb-2">
            <div
              className={cn(
                "mb-2 h-px bg-border",
                showLabels ? "mx-4" : "mx-3",
              )}
              aria-hidden="true"
            />

            <nav
              aria-label="Account"
              className={cn("flex flex-col gap-0.5", showLabels ? "px-3" : "px-0")}
            >
              {SECONDARY_NAV.map((item) => (
                <SidebarNavItem
                  key={item.to}
                  {...item}
                  collapsed={!showLabels}
                  onClick={onCloseMobile}
                />
              ))}
            </nav>

            <div className={cn("mt-3", showLabels ? "px-3" : "px-0")}>
              <SidebarTooltip label={name} disabled={showLabels}>
                <NavLink
                  to="/settings"
                  onClick={onCloseMobile}
                  aria-label={`Profile · ${name}`}
                  className={cn(
                    "flex h-10 items-center rounded-lg",
                    showLabels ? "gap-3 px-3" : "mx-auto size-10 justify-center px-0",
                    "transition-colors duration-base ease-premium hover:bg-background-secondary",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-background-secondary text-[11px] font-semibold text-text">
                    {initials || <User className="size-3.5" aria-hidden="true" />}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 overflow-hidden whitespace-nowrap",
                      "transition-opacity duration-200 ease-premium motion-reduce:transition-none",
                      showLabels ? "flex-1 opacity-100" : "hidden",
                    )}
                    aria-hidden={!showLabels}
                  >
                    <span className="block truncate text-sm font-medium text-text">{name}</span>
                  </span>
                </NavLink>
              </SidebarTooltip>

              <button
                type="button"
                onClick={onToggleCollapsed}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-expanded={!collapsed}
                className={cn(
                  "mt-1 hidden h-10 items-center rounded-lg text-text-muted lg:flex",
                  "hover:bg-background-secondary hover:text-text",
                  "transition-colors duration-base ease-premium",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  showLabels ? "w-full gap-3 px-3" : "mx-auto size-10 justify-center px-0",
                )}
              >
                <ChevronsLeft
                  className={cn(
                    "size-4 shrink-0 transition-transform duration-300 ease-premium motion-reduce:transition-none",
                    collapsed && "rotate-180",
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    showLabels ? "opacity-100" : "hidden",
                  )}
                >
                  Collapse
                </span>
              </button>
            </div>
          </div>
        </aside>
      </Tooltip.Provider>
    </>
  );
}
