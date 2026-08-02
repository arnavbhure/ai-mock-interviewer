import type { ReactNode } from "react";
import { AuthCard } from "@/auth/shared/AuthCard";

type LoginCardProps = {
  children: ReactNode;
};

export function LoginCard({ children }: LoginCardProps) {
  return <AuthCard>{children}</AuthCard>;
}

