import type { LucideIcon } from "lucide-react";

export type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type VerifyOtpFormValues = {
  otp: string;
};

export type LoginFormStatus = "idle" | "submitting" | "success" | "error";

export type LoginFeatureChip = {
  label: string;
  icon: LucideIcon;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    full_name: string;
  };
};
