import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { OtpInput } from "@/auth/verify-otp/OtpInput";
import { ResendTimer } from "@/auth/verify-otp/ResendTimer";
import { FieldError } from "@/auth/shared/FieldError";
import { Button } from "@/components/ui/button";
import { VERIFY_OTP_BUTTON } from "@/constants/auth.constants";
import { useVerifyOtpForm } from "@/hooks/useVerifyOtpForm";

type VerifyOtpFormProps = {
  email: string;
};

export function VerifyOtpForm({ email }: VerifyOtpFormProps) {
  const { watch, setValue, formState, isSubmitting, isResending, onSubmit, handleResend } =
    useVerifyOtpForm(email);

  const otp = watch("otp");
  const error = formState.errors.otp?.message;

  const handleChange = (value: string) => {
    setValue("otp", value, { shouldValidate: true });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
      <div className="space-y-2">
        <label id="otp-label" className="text-sm font-medium text-foreground">
          Verification code
        </label>

        <OtpInput
          value={otp}
          onChange={handleChange}
          invalid={Boolean(error)}
          disabled={isSubmitting}
          aria-describedby={error ? "otp-error" : undefined}
        />

        <FieldError message={error} />
      </div>

      <motion.div whileTap={{ scale: 0.995 }} transition={{ duration: 0.15 }}>
        <Button
          type="submit"
          variant="primary"
          className="h-12 w-full gap-2 text-sm font-medium shadow-none"
          disabled={isSubmitting || otp.length < 6}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} strokeWidth={1.75} className="animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <ShieldCheck size={16} strokeWidth={1.75} />
              {VERIFY_OTP_BUTTON}
            </>
          )}
        </Button>
      </motion.div>

      <ResendTimer onResend={handleResend} isResending={isResending} />

      <p className="text-center text-sm text-muted-foreground">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 font-medium text-primary hover:text-primary/90"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          Back to login
        </Link>
      </p>
    </form>
  );
}

