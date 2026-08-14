import { motion } from "framer-motion";
import type { Toast as HotToast } from "react-hot-toast";
import { ToastCloseButton } from "@/components/ui/toast/ToastCloseButton";
import { ToastIcon, type ToastType } from "@/components/ui/toast/ToastIcon";

export type ToastMessage = {
  title: string;
  description?: string;
};

type ToastCardProps = {
  t: HotToast;
  type: ToastType;
  message: ToastMessage;
};

const toastMotion = {
  initial: { opacity: 0, y: -12, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.98 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
};

export function ToastCard({ t, type, message }: ToastCardProps) {
  return (
    <motion.div
      layout
      initial={toastMotion.initial}
      animate={toastMotion.animate}
      exit={toastMotion.exit}
      transition={toastMotion.transition}
      role="status"
      aria-live="polite"
      className="pointer-events-auto flex w-full max-w-[380px] items-center gap-3 rounded-large border border-border bg-surface p-4 text-text shadow-modal"
    >
      <ToastIcon type={type} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-snug text-text">
          {message.title}
        </p>
        {message.description ? (
          <p className="mt-0.5 text-sm leading-snug text-text-secondary">
            {message.description}
          </p>
        ) : null}
      </div>
      <ToastCloseButton toastId={t.id} />
    </motion.div>
  );
}
