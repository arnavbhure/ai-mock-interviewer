import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import dashboardBg from "@/assets/background_image_dashboard.jpg";

const SIDEBAR_KEY = "interviewai-sidebar-collapsed";

const PAGE_META: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "Dashboard" },
  "/dashboard/new": {
    title: "New interview",
    subtitle: "Set up your practice session",
  },
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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const meta = PAGE_META[location.pathname] ?? { title: "Dashboard" };

  return (
    <div className="flex min-h-dvh bg-background text-text">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-premium motion-reduce:transition-none">
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main
          className="relative z-0 min-w-0 flex-1"
          style={{
            backgroundImage: `url(${dashboardBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundColor: "rgba(247, 248, 250, 0.30)" }}
            aria-hidden="true"
          />
          <div className="relative">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
