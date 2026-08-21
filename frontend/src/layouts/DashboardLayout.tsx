import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/TopBar";

const SIDEBAR_KEY = "interviewai-sidebar-collapsed";

const PAGE_META: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Performance overview" },
  "/dashboard/new": { title: "New interview", subtitle: "Set up your practice session" },
  "/interviews": { title: "Interviews", subtitle: "All practice sessions" },
  "/reports": { title: "Reports", subtitle: "Detailed performance breakdowns" },
  "/progress": { title: "Progress", subtitle: "Skill development over time" },
  "/settings": { title: "Settings", subtitle: "Account and preferences" },
  "/help": { title: "Help & support", subtitle: "Guides and answers" },
};

function readCollapsedPreference(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === "1";
  } catch {
    return false;
  }
}

export function DashboardLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(readCollapsedPreference);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
    } catch {
      // Storage unavailable — keep the in-memory state.
    }
  }

  const meta = PAGE_META[location.pathname] ?? { title: "Dashboard" };

  return (
    <div className="flex min-h-dvh bg-background text-text">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="min-w-0 flex-1 flex flex-col">
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

