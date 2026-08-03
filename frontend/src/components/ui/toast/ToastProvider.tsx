import { Toaster, type ToasterProps } from "react-hot-toast";
import type { ReactNode } from "react";

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const toasterProps: ToasterProps = {
    position: "top-right",
    reverseOrder: false,
    gutter: 12,
    toastOptions: {
      duration: 3000,
      style: {
        background: "transparent",
        boxShadow: "none",
        padding: 0,
        maxWidth: "100%",
      },
    },
    containerStyle: {
      top: 8,
      right: 8,
    },
  };

  return (
    <>
      {children}
      <Toaster {...toasterProps} containerClassName="toaster-container" />
    </>
  );
}
