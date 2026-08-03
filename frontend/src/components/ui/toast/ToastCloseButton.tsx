import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

type ToastCloseButtonProps = {
  toastId: string;
  className?: string;
};

export function ToastCloseButton({
  toastId,
  className,
}: ToastCloseButtonProps) {
  return (
    <button
      type="button"
      aria-label="Dismiss notification"
      title="Dismiss"
      onClick={() => toast.dismiss(toastId)}
      className={cn(
        "-m-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 ease-premium hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}
