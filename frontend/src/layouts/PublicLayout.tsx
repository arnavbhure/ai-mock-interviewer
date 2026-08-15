import { Outlet } from "react-router-dom";
import { Footer } from "@/components/footer";
import { MarketingNavbar } from "@/components/navigation/MarketingNavbar";

export function PublicLayout() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-text transition-colors duration-base ease-premium">
      <div id="top">
        <MarketingNavbar />
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

