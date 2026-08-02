import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function RegisterPage() {
  return (
    <main className="relative flex min-h-dvh items-center overflow-hidden bg-background text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-8rem] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-md px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-primary">
              <Sparkles size={14} strokeWidth={1.75} />
              Coming soon
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-foreground">
              Create your account
            </h1>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The registration flow is being built. It will be available here shortly.
            </p>

            <div className="mt-8">
              <Button asChild variant="primary" className="h-12 w-full gap-2 text-sm font-medium shadow-none">
                <Link to="/login">
                  Back to Login
                  <ArrowRight size={16} strokeWidth={1.75} />
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

