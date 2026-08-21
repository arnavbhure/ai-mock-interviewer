import * as Dialog from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { NavbarLogo } from "@/components/navigation/NavbarLogo";
import { NavLinks } from "@/components/navigation/NavLinks";
import { mobileMenuVariants, NAV_EASING } from "@/components/navigation/navbar.animations";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

export function MobileMenu({ isOpen, onRequestClose }: MobileMenuProps) {
  const reduced = useReducedMotion();

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onRequestClose();
      }}
    >
      <Dialog.Portal>
        {/* Backdrop with fade animation */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2, ease: NAV_EASING }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        />

        {/* Sidebar with slide animation */}
        <Dialog.Content
          asChild
          className={cn(
            "fixed right-0 top-0 z-60 flex h-dvh w-[min(88vw,22rem)] flex-col",
            "border-l border-border bg-background shadow-[0_20px_48px_rgba(0,0,0,0.45)]",
            "outline-none",
          )}
        >
          <motion.div
            initial={reduced ? undefined : "hidden"}
            animate={reduced ? undefined : "show"}
            exit={reduced ? undefined : "exit"}
            variants={mobileMenuVariants}
            className="flex h-full flex-col"
          >
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/60 px-5">
              <Dialog.Title className="sr-only">Menu</Dialog.Title>
              <NavbarLogo />

              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close menu"
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-button text-text-secondary",
                    "transition-colors duration-200 ease-premium hover:bg-surface hover:text-text",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <NavLinks mobile onNavigate={onRequestClose} />
            </div>

            {/* Authentication actions */}
            <div className="shrink-0 space-y-3 border-t border-border/60 px-5 py-4">
              <Link
                to="/login"
                onClick={onRequestClose}
                className={cn(
                  "block w-full rounded-button border border-border bg-transparent px-4 py-2.5 text-center text-sm font-medium text-text",
                  "transition-colors duration-200 ease-premium hover:border-border-hover hover:bg-surface",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={onRequestClose}
                className={cn(
                  "group flex w-full items-center justify-center gap-1.5 rounded-button bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground",
                  "transition-[background-color,box-shadow] duration-200 ease-premium",
                  "hover:bg-primary-bright hover:shadow-[0_2px_10px_rgba(77,130,255,0.28)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <span>Start Interview</span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
