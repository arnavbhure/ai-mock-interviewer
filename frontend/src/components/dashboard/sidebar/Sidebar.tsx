"use client";

import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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

function BrandLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      to="/dashboard"
      className={cn(
        "flex h-12 items-center gap-3 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg",
        collapsed ? "justify-center px-0 w-full" : "px-1",
      )}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Sparkles className="size-5" />
      </div>
      <div
        className={cn(
          "flex flex-col min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300",
          collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
        )}
      >
        <span className="text-base font-bold tracking-tight text-text">InterviewAI</span>
                <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
          Candidate Portal
        </span>
      </div>
    </Link>
  );
}

function UserProfileCard({ collapsed }: { collapsed: boolean }) {
  const user = useAuthStore((state) => state.user);
  const name = user?.name || "Arnav Bhure";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <SidebarTooltip label={name} disabled={!collapsed}>
      <div
        className={cn(
          "flex items-center rounded-lg p-2 transition-all duration-300 bg-surface-elevated/50 border border-border/50",
          collapsed ? "justify-center px-0" : "gap-3 px-2.5 py-2",
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {initials}
        </div>
        <div
          className={cn(
            "flex flex-col min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100 flex-1",
          )}
        >
          <span className="text-xs font-semibold text-text truncate">{name}</span>
          <span className="text-[11px] text-text-muted truncate">Candidate</span>
        </div>
      </div>
    </SidebarTooltip>
  );
}