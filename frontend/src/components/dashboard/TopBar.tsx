import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, ChevronDown, LogOut, Menu, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

type TopBarProps = {
  title: string;
  subtitle?: string;
  onOpenMobile: () => void;
};

export function TopBar({ title, subtitle, onOpenMobile }: TopBarProps) {
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const navigate = useNavigate();

  const name = user?.name?.trim() || user?.email?.split("@")[0] || "Candidate";
  const cleanName = name.trim();
  const email = user?.email;
  const initials = cleanName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  function handleLogout() {
    clearUser();
    navigate("/login");
  }

  const menuItemClass = cn(
    "flex h-9 cursor-pointer items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-text-secondary",
    "outline-none select-none data-[highlighted]:bg-surface-elevated data-[highlighted]:text-text",
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-surface/80 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <button
        type="button"
        onClick={onOpenMobile}
        className="inline-flex size-9 items-center justify-center rounded-lg text-text-muted lg:hidden transition-colors duration-base ease-premium hover:bg-surface-elevated hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open menu"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <div className="min-w-0 flex flex-col">
        <h1 className="truncate text-sm font-semibold tracking-tight text-text">{title}</h1>
        {subtitle && <p className="truncate text-xs text-text-muted">{subtitle}</p>}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          className="relative inline-flex size-9 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-elevated hover:text-text transition-colors duration-base ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary"
          />
        </button>

        <span aria-hidden="true" className="h-5 w-[1px] bg-border" />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex h-9 shrink-0 items-center gap-2 rounded-lg pl-1 pr-1.5 text-text-secondary hover:bg-surface-elevated hover:text-text transition-colors duration-base ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open profile menu"
            >
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {initials || <User className="size-3.5" aria-hidden="true" />}
              </span>
              <span className="hidden md:flex max-w-[12rem] flex flex-col items-start text-left">
                <span className="truncate text-xs font-medium text-text">{cleanName}</span>
                {email && <span className="truncate text-[11px] text-text-muted">{email}</span>}
              </span>
              <ChevronDown className="size-3.5 text-text-muted" aria-hidden="true" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              side="bottom"
              align="end"
              sideOffset={10}
              className="z-60 w-64 rounded-card border border-border bg-surface p-1.5 shadow-modal"
            >
              <div className="rounded-lg px-3 py-2">
                <p className="truncate text-sm font-medium text-text">{cleanName}</p>
                {email && <p className="truncate text-xs text-text-muted">{email}</p>}
              </div>
              <DropdownMenu.Separator className="my-1 h-[1px] bg-border" />
              <DropdownMenu.Item
                onSelect={() => navigate("/settings")}
                className={menuItemClass}
              >
                <User className="size-[15px]" aria-hidden="true" />
                Account
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => navigate("/settings")}
                className={menuItemClass}
              >
                <Settings className="size-[15px]" aria-hidden="true" />
                Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-[1px] bg-border" />
              <DropdownMenu.Item
                onSelect={handleLogout}
                className={cn(menuItemClass, "text-error")}
              >
                <LogOut className="size-[15px]" aria-hidden="true" />
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}