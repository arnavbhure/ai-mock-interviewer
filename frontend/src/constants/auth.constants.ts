import { FileText, Sparkles, Zap } from "lucide-react";
import { z } from "zod";
import type {
  LoginFeatureChip,
  LoginFormValues,
  RegisterFormValues,
} from "@/types/auth.types";

export const loginFormSchema: z.ZodType<LoginFormValues> = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  rememberMe: z.boolean(),
});

export const registerFormSchema: z.ZodType<RegisterFormValues> = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required.")
      .min(2, "Full name must be at least 2 characters."),
    email: z
      .string()
      .trim()
      .min(1, "Email address is required.")
      .email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password.")
      .min(8, "Password must be at least 8 characters."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const LOGIN_FIELD_LABELS = {
  email: "Email address",
  password: "Password",
} as const;

export const LOGIN_FIELD_PLACEHOLDERS = {
  email: "you@example.com",
  password: "Enter your password",
} as const;

export const LOGIN_HEADLINE = "Welcome back";
export const LOGIN_DESCRIPTION = "Sign in to continue your interview practice.";

export const LOGIN_PREVIEW_HEADLINE = "Practice real interviews with AI.";
export const LOGIN_PREVIEW_DESCRIPTION =
  "Personalized interviews generated from your resume, skills, and projects — with real-time feedback after every answer.";

export const LOGIN_FEATURE_CHIPS: LoginFeatureChip[] = [
  { label: "AI Powered", icon: Sparkles },
  { label: "Resume Based", icon: FileText },
  { label: "Real-time Feedback", icon: Zap },
];

export const REGISTER_FIELD_LABELS = {
  fullName: "Full Name",
  email: "Email Address",
  password: "Password",
  confirmPassword: "Confirm Password",
} as const;

export const REGISTER_FIELD_PLACEHOLDERS = {
  fullName: "John Doe",
  email: "you@example.com",
  password: "Create a password",
  confirmPassword: "Re-enter your password",
} as const;

export const REGISTER_HEADLINE = "Create your account";
export const REGISTER_DESCRIPTION =
  "Start practicing real interviews in less than a minute.";

export const REGISTER_PREVIEW_HEADLINE = "Start Your Interview Journey";
export const REGISTER_PREVIEW_DESCRIPTION =
  "Create your InterviewAI account and begin practicing personalized mock interviews designed to improve your confidence and technical skills.";

export const VERIFY_OTP_HEADLINE = "Verify your email";
export const VERIFY_OTP_DESCRIPTION =
  "Enter the 6-digit verification code sent to";
export const VERIFY_OTP_BUTTON = "Verify & Continue";
