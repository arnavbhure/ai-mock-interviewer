import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/user.store";
import { NavbarAccountDropdown } from "@/components/navigation/NavbarAccountDropdown";

export function NavbarActions() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick link to Dashboard */}
        <Link
          to="/dashboard"
          className={cn(
            "group inline-flex h-9 items-center gap-1.5 rounded-button bg-primary px-3.5 sm:px-4 text-sm font-medium text-primary-foreground",
            "transition-[background-color,box-shadow] duration-200 ease-premium",
            "hover:bg-primary-bright hover:shadow-[0_2px_10px_rgba(77,130,255,0.28)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Dashboard</span>
        </Link>

        {/* Account Dropdown */}
        <NavbarAccountDropdown />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Login */}
      <Link
        to="/login"
        className={cn(
          "rounded-button px-3 py-2 text-sm font-medium text-text-secondary",
          "transition-colors duration-200 ease-premium hover:text-text",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        Login
      </Link>

      {/* Primary CTA */}
      <Link
        to="/register"
        className={cn(
          "group inline-flex h-9 items-center gap-1.5 rounded-button bg-primary px-4 text-sm font-medium text-primary-foreground",
          "transition-[background-color,box-shadow] duration-200 ease-premium",
          "hover:bg-primary-bright hover:shadow-[0_2px_10px_rgba(77,130,255,0.28)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <span>Start Interview</span>
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </Link>
    </div>
  );
}