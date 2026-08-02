import { Outlet } from "react-router-dom";

/**
 * Placeholder dashboard layout.
 * Will be implemented together with the Dashboard feature.
 */
export function DashboardLayout() {
  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

