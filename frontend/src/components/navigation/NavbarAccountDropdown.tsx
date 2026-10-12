import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LayoutDashboard, LogOut, Settings, Sparkles, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/user.store";
import { useInterviewStore } from "@/store/interview.store";
import { logout } from "@/api/auth/auth.api";

export function NavbarAccountDropdown() {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();

  const name = user?.name?.trim() || user?.email?.split("@")[0] || "Candidate";
  const cleanName = name.trim();
  const email = user?.email;
  const initials = cleanName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  async function handleLogout() {
    try {
      await logout();
    } finally {
      clearUser();
      useInterviewStore.getState().resetInterview();
      navigate("/");
    }
  }

  const menuItemClass = cn(
    "flex h-9 cursor-pointer items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-text-secondary",
    "outline-none select-none transition-colors duration-150 data-[highlighted]:bg-surface-elevated data-[highlighted]:text-text",
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 shrink-0 items-center gap-2 rounded-full border border-border/80 bg-surface/70 pl-1 pr-2.5 text-text-secondary",
            "backdrop-blur-md shadow-sm transition-all duration-200 ease-premium",
            "hover:bg-surface-elevated hover:text-text hover:border-border",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          aria-label="Open profile menu"
        >
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials || <User className="size-3.5" aria-hidden="true" />}
          </span>
          <span className="hidden sm:inline-block max-w-[7.5rem] truncate text-xs font-medium text-text">
            {cleanName}
          </span>
          <ChevronDown className="size-3.5 text-text-muted" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="bottom"
          align="end"
          sideOffset={8}
          className="z-60 w-60 rounded-card border border-border bg-surface/95 p-1.5 shadow-modal backdrop-blur-xl animate-in fade-in-0 zoom-in-95"
        >
          {/* User Profile summary */}
          <div className="rounded-lg px-3 py-2">
            <p className="truncate text-sm font-semibold text-text">{cleanName}</p>
            {email && <p className="truncate text-xs text-text-muted">{email}</p>}
          </div>

          <DropdownMenu.Separator className="my-1 h-[1px] bg-border" />

          {/* Navigation Items */}
          <DropdownMenu.Item
            onSelect={() => navigate("/dashboard")}
            className={menuItemClass}
          >
            <LayoutDashboard className="size-4" aria-hidden="true" />
            Dashboard
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={() => navigate("/dashboard/new")}
            className={menuItemClass}
          >
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            New Interview
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={() => navigate("/settings")}
            className={menuItemClass}
          >
            <Settings className="size-4" aria-hidden="true" />
            Settings
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-[1px] bg-border" />

          {/* Logout Action */}
          <DropdownMenu.Item
            onSelect={handleLogout}
            className={cn(menuItemClass, "text-red-500 hover:text-red-600 data-[highlighted]:text-red-600 data-[highlighted]:bg-red-500/10")}
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
