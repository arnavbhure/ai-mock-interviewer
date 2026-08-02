import { FileText, Sparkles, Zap } from "lucide-react";
import { z } from "zod";
import type { LoginFeatureChip, LoginFormValues } from "@/types/auth.types";

export const loginFormSchema: z.ZodType<LoginFormValues> = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  rememberMe: z.boolean(),
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

