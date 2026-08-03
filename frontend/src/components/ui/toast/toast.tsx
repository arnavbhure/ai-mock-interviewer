import { toast, type ToastOptions } from "react-hot-toast";
import { ToastCard, type ToastMessage } from "@/components/ui/toast/ToastCard";
import type { ToastType } from "@/components/ui/toast/ToastIcon";

const DURATION: Record<Exclude<ToastType, "loading">, number> = {
  success: 3000,
  info: 3000,
  warning: 4000,
  error: 5000,
};

type ToastHelperOptions = {
  description?: string;
  id?: string;
};

function showToast(
  type: ToastType,
  { title, description }: ToastMessage,
  options: ToastHelperOptions = {},
) {
  const toastOptions: ToastOptions = {
    duration: type === "loading" ? Infinity : DURATION[type],
  };

  if (options.id) {
    toastOptions.id = options.id;
  }

  return toast.custom(
    (t) => <ToastCard t={t} type={type} message={{ title, description }} />,
    toastOptions,
  );
}

export function toastSuccess(title: string, options?: ToastHelperOptions) {
  return showToast("success", { title, description: options?.description }, options);
}

export function toastError(title: string, options?: ToastHelperOptions) {
  return showToast("error", { title, description: options?.description }, options);
}

export function toastInfo(title: string, options?: ToastHelperOptions) {
  return showToast("info", { title, description: options?.description }, options);
}

export function toastWarning(title: string, options?: ToastHelperOptions) {
  return showToast("warning", { title, description: options?.description }, options);
}

export function toastLoading(title: string, options?: ToastHelperOptions) {
  return showToast("loading", { title, description: options?.description }, options);
}

export function toastDismiss(id?: string) {
  if (id === undefined) {
    toast.dismiss();
    return;
  }
  toast.dismiss(id);
}
