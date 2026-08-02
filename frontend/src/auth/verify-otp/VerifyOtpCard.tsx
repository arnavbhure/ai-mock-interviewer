import type { ReactNode } from "react";
import { AuthCard } from "@/auth/shared/AuthCard";

type VerifyOtpCardProps = {
  children: ReactNode;
};

export function VerifyOtpCard({ children }: VerifyOtpCardProps) {
  return <AuthCard>{children}</AuthCard>;
}

