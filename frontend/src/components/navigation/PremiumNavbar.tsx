import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import logoMark from "@/assets/Logo.png";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Demo", href: "#demo" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

function NavPill({
  href,
  children,
  onClick,
  mobile = false,
}: {
  href: string;
  children: ReactNode;
  onClick?: () => void;
  mobile?: boolean;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={reducedMotion ? undefined : { y: -1 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "inline-flex items-center rounded-full text-sm font-medium text-muted-foreground transition-colors duration-250 ease-premium hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        mobile ? "w-full justify-between px-4 py-3 text-base" : "px-4 py-2",
      )}
    >
      {children}
    </motion.a>
  );
}

function SheetActionLink({
  children,
  href,
  onClick,
  variant = "ghost",
}: {
  children: ReactNode;
  href: string;
  onClick?: () => void;
  variant?: "ghost" | "secondary" | "primary";
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reducedMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <Button
        asChild
        variant={variant === "primary" ? "primary" : variant === "secondary" ? "secondary" : "ghost"}
        className="h-12 w-full justify-center gap-2 px-5"
      >
        <Link to={href} onClick={onClick}>
          {children}
        </Link>
      </Button>
    </motion.div>
  );
}

export function PremiumNavbar() {
  const reducedMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shellClassName = useMemo(
    () =>
      cn(
        "flex items-center justify-between gap-6 overflow-hidden border px-1 transition-all duration-500 ease-premium",
        isScrolled
          ? "h-[72px] rounded-[30px] border-border/70 bg-card/90 shadow-card backdrop-blur-2xl"
          : "h-[88px] rounded-none border-transparent bg-transparent shadow-none backdrop-blur-0",
      ),
    [isScrolled],
  );

  return (
    <>
      <div aria-hidden="true" className="h-24 md:h-28" />

      <header className="fixed left-0 right-0 top-4 z-50 w-full">
        <div className="mx-auto w-full max-w-340 px-5 sm:px-7 lg:px-10">
          <motion.div
            animate={reducedMotion ? undefined : { scale: isScrolled ? 0.995 : 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={shellClassName}
          >
            <div className="flex h-full items-center pl-1">
              <a
                href="#top"
                aria-label="InterviewAI home"
                className="group flex items-center outline-none transition-transform duration-250 ease-premium focus-visible:ring-2 focus-visible:ring-ring"
              >
                <motion.img
                  alt="InterviewAI logo"
                  animate={reducedMotion ? undefined : { scale: isScrolled ? 0.98 : 1 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="h-20 w-auto object-contain"
                  src={logoMark}
                />
              </a>
            </div>

            <nav aria-label="Primary" className="hidden h-full items-center lg:flex">
              <div className="flex items-center gap-1">
                {NAV_ITEMS.map((item) => (
                  <NavPill key={item.href} href={item.href}>
                    {item.label}
                  </NavPill>
                ))}
              </div>
            </nav>

            <div className="flex h-full items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 md:flex">
                <ThemeToggle />

                <Button asChild variant="ghost" className="h-12 px-4 text-sm font-medium">
                  <Link to="/login">Login</Link>
                </Button>

                <motion.div
                  whileHover={reducedMotion ? undefined : { y: -2 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Button asChild variant="primary" className="h-12 gap-2 px-5 text-sm font-medium shadow-none">
                    <Link to="/register">
                      <span>Start Free Interview</span>
                      <motion.span
                        animate={reducedMotion ? undefined : { x: 0 }}
                        whileHover={reducedMotion ? undefined : { x: 3 }}
                        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        aria-hidden="true"
                        className="inline-flex"
                      >
                        <ArrowRight size={16} strokeWidth={1.75} />
                      </motion.span>
                    </Link>
                  </Button>
                </motion.div>
              </div>

              <div className="flex items-center gap-2 md:hidden">
                <ThemeToggle />

                <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
                  <Dialog.Trigger asChild>
                    <Button type="button" variant="icon" size="icon" aria-label="Open navigation menu">
                      <Menu size={20} strokeWidth={1.75} />
                    </Button>
                  </Dialog.Trigger>

                  <AnimatePresence>
                    {mobileOpen ? (
                      <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-sm"
                          />
                        </Dialog.Overlay>

                        <Dialog.Content asChild>
                          <motion.aside
                            initial={reducedMotion ? false : { x: 24, opacity: 0 }}
                            animate={reducedMotion ? undefined : { x: 0, opacity: 1 }}
                            exit={reducedMotion ? undefined : { x: 24, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed right-0 top-0 z-50 flex h-dvh w-[min(92vw,24rem)] flex-col rounded-l-4xl border-l border-y border-border/70 bg-card px-5 pb-5 pt-5 text-card-foreground shadow-modal outline-none"
                          >
                            <div className="mb-5 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <img
                                  alt="InterviewAI logo"
                                  className="h-12 w-auto object-contain"
                                  src={logoMark}
                                />
                                <div>
                                  <p className="text-sm font-semibold text-foreground">InterviewAI</p>
                                  <p className="text-xs text-muted-foreground">Premium mock interviews</p>
                                </div>
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

                            <div className="flex-1 space-y-2 border-y border-border/60 py-4">
                              {NAV_ITEMS.map((item) => (
                                <Dialog.Close key={item.href} asChild>
                                  <NavPill href={item.href} mobile onClick={() => setMobileOpen(false)}>
                                    {item.label}
                                    <ArrowRight size={16} strokeWidth={1.75} className="text-muted-foreground" />
                                  </NavPill>
                                </Dialog.Close>
                              ))}
                            </div>

                            <div className="mt-5 space-y-3">
                              <div className="rounded-[18px] border border-border/70 bg-secondary/60 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                  Theme
                                </p>
                                <div className="mt-3 flex items-center justify-between gap-3">
                                  <span className="text-sm text-foreground">Switch appearance</span>
                                  <ThemeToggle />
                                </div>
                              </div>

                              <SheetActionLink href="/login" onClick={() => setMobileOpen(false)} variant="secondary">
                                Login
                              </SheetActionLink>

                              <SheetActionLink href="/register" onClick={() => setMobileOpen(false)} variant="primary">
                                Start Free Interview
                                <ArrowRight size={16} strokeWidth={1.75} />
                              </SheetActionLink>
                            </div>
                          </motion.aside>
                        </Dialog.Content>
                      </Dialog.Portal>
                    ) : null}
                  </AnimatePresence>
                </Dialog.Root>
              </div>
            </div>
          </motion.div>
        </div>
      </header>
    </>
  );
}
