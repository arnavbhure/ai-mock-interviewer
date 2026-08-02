import { Outlet } from "react-router-dom";
import { Footer } from "@/components/footer";
import { PremiumNavbar } from "@/components/navigation/PremiumNavbar";

export function PublicLayout() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground transition-colors duration-250 ease-premium">
      <div id="top">
        <PremiumNavbar />
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

