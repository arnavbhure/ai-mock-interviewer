import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { verifyOtp } from "@/api/auth/auth.api";
import { verifyOtpSchema } from "@/validation/verifyOtp.schema";
import { createZodResolver } from "@/lib/zod-resolver";
import type { VerifyOtpFormValues } from "@/types/auth.types";

const verifyOtpResolver = createZodResolver(verifyOtpSchema);

export function useVerifyOtpForm(email: string) {
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);

  const form = useForm<VerifyOtpFormValues>({
    resolver: verifyOtpResolver,
    defaultValues: {
      otp: "",
    },
    mode: "onTouched",
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    const toastId = toast.loading("Verifying code...");

    try {
      const response = await verifyOtp({ email, otp: values.otp });

      if (!response.success) {
        toast.error(response.message, { id: toastId });
        return;
      }

      toast.success(response.message, { id: toastId });
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Unable to verify the code. Please try again.", {
        id: toastId,
      });
    }
  });

  const handleResend = useCallback(async () => {
    setIsResending(true);

    // TODO:
    // Call POST /auth/resend-otp
    // Payload: { email }
    //
    // const response = await resendOtp({ email });
    // if (!response.success) {
    //   toast.error(response.message);
    //   return;
    // }
    // toast.success("Verification code resent.");

    // Placeholder until the API is integrated.
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    toast.success("Verification code resent.");

    setIsResending(false);
  }, [email]);

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    watch: form.watch,
    setValue: form.setValue,
    formState: form.formState,
    isSubmitting,
    isResending,
    onSubmit,
    handleResend,
  };
}
