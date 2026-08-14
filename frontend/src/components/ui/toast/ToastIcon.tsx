import {
  CheckCircle2,
  CircleX,
  Info,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

const ICON_MAP: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
  loading: Loader2,
};

const TONE_CLASS: Record<ToastType, string> = {
  success: "text-success",
  error: "text-error",
  warning: "text-warning",
  info: "text-primary",
  loading: "text-primary",
};

type ToastIconProps = {
  type: ToastType;
  className?: string;
};

export function ToastIcon({ type, className }: ToastIconProps) {
  const Icon = ICON_MAP[type];
  const isLoading = type === "loading";

  return (
    <Icon
      aria-hidden="true"
      className={cn(
        "h-5 w-5 shrink-0",
        TONE_CLASS[type],
        isLoading && "animate-spin",
        className,
      )}
      strokeWidth={1.75}
    />
  );
}
