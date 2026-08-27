import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * End DSA Interview Confirmation Dialog
 */
export function DSAEndDialog({ isOpen, onClose, onConfirm }: Props) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 10 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white">
                  End DSA Coding Interview?
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  Your code solutions and test evaluations will be preserved. Are you sure you want to end this round?
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-xs text-slate-300 hover:text-white hover:bg-white/10"
              >
                Continue Coding
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-500 text-white text-xs gap-1.5 font-medium shadow-md shadow-red-950"
              >
                <LogOut className="h-3.5 w-3.5" />
                End Round
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
