import { LayoutDashboard } from "lucide-react";

/**
 * Placeholder dashboard page.
 * Will be implemented together with the Dashboard feature.
 */
export function DashboardPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <div className="mx-auto inline-flex size-14 items-center justify-center rounded-card border border-border/70 bg-card shadow-card">
          <LayoutDashboard
            size={24}
            strokeWidth={1.75}
            className="text-primary"
          />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-foreground">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your interview workspace is on its way.
        </p>
      </div>
    </main>
  );
}
