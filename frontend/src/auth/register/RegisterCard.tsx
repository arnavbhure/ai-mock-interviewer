import type { ReactNode } from "react";
import { AuthCard } from "@/auth/shared/AuthCard";

type RegisterCardProps = {
  children: ReactNode;
};

export function RegisterCard({ children }: RegisterCardProps) {
  return <AuthCard>{children}</AuthCard>;
}

