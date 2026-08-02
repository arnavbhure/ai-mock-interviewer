import { motion, useReducedMotion } from "framer-motion";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function FooterBottom() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-4 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1 text-sm text-muted-foreground">
        <p>© 2026 InterviewAI</p>
        <p>Made with <span aria-hidden="true">♥</span> for future engineers.</p>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          Developed with <span role="img" aria-label="love">❤️</span> by{" "}
          <a
            href="https://linkedin.com/in/arnavbhure"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            ~arnavbhure
          </a>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
          v1.0.0
        </div>
        <motion.div whileHover={reducedMotion ? undefined : { y: -1 }} transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}>
          <ThemeToggle />
        </motion.div>
      </div>
    </div>
  );
}
