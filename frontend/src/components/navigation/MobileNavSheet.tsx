import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { mobileItemVariants, mobileMenuVariants, NAV_EASING } from "@/components/navigation/navbar.animations";
import { NAV_ITEMS } from "@/components/navigation/navbar.constants";
import { NavPill } from "@/components/navigation/NavPill";

export function MobileNavSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button type="button" variant="icon" size="icon" aria-label="Open navigation menu">
          <Menu size={20} strokeWidth={1.75} />
        </Button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: NAV_EASING }}
                className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.aside
                initial="hidden"
                animate="show"
                exit="exit"
                variants={mobileMenuVariants}
                className="fixed right-0 top-0 z-50 flex h-dvh w-[min(92vw,24rem)] flex-col rounded-l-4xl border-l border-y border-navbar-border bg-navbar/90 pb-5 pt-5 text-card-foreground shadow-navbar outline-none backdrop-blur-2xl"
              >
                <div className="mb-5 flex items-center justify-between gap-4 px-5">
                  <div>
                    <p className="text-sm font-semibold text-foreground">InterviewAI</p>
                    <p className="text-xs text-muted-foreground">Premium mock interviews</p>
                  </div>

                  <Dialog.Close asChild>
                    <Button type="button" variant="icon" size="icon" aria-label="Close navigation menu">
                      <X size={20} strokeWidth={1.75} />
                    </Button>
                  </Dialog.Close>
                </div>

                <Dialog.Title className="sr-only">Primary navigation</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Navigation links, theme toggle, and account actions.
                </Dialog.Description>

                <motion.div
                  initial="hidden"
                  animate="show"
                  className="flex-1 space-y-1 overflow-y-auto border-y border-navbar-border/60 px-3 py-4"
                >
                  {NAV_ITEMS.map((item, index) => (
                    <motion.div key={item.href} custom={index} variants={mobileItemVariants}>
                      <Dialog.Close asChild>
                        <NavPill item={item} mobile onClick={() => setOpen(false)} />
                      </Dialog.Close>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="mt-5 space-y-3 px-5">
                  <div className="flex items-center justify-between gap-3 rounded-[18px] border border-navbar-border/60 bg-secondary/60 px-4 py-3">
                    <span className="text-sm text-foreground">Switch appearance</span>
                    <ThemeToggle />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <Button asChild variant="secondary" className="h-12 w-full justify-center px-5 text-sm font-medium">
                      <Link to="/login" onClick={() => setOpen(false)}>
                        Login
                      </Link>
                    </Button>

                    <Button asChild variant="primary" className="h-12 w-full justify-center gap-2 px-5 text-sm font-medium shadow-none">
                      <Link to="/register" onClick={() => setOpen(false)}>
                        Start Free Interview
                        <ArrowRight size={16} strokeWidth={1.75} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

