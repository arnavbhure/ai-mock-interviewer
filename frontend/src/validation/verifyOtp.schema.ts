import { z } from "zod";
import type { VerifyOtpFormValues } from "@/types/auth.types";

/**
 * OTP must contain exactly six numeric digits.
 * Regex enforces digits only and rejects partial/empty input.
 */
export const verifyOtpSchema: z.ZodType<VerifyOtpFormValues> = z.object({
  otp: z
    .string()
    .trim()
    .min(6, "Enter the 6-digit verification code.")
    .max(6, "The verification code must be exactly 6 digits.")
    .regex(/^\d{6}$/, "The verification code must contain only numbers."),
});
