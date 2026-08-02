import { Navigate, useLocation } from "react-router-dom";
import { VerifyOtpCard } from "@/auth/verify-otp/VerifyOtpCard";
import { VerifyOtpForm } from "@/auth/verify-otp/VerifyOtpForm";
import { VerifyOtpHeader } from "@/auth/verify-otp/VerifyOtpHeader";

type LocationState = {
  email?: string;
};

export function VerifyOtpPage() {
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;
  const email = state.email ?? "";

  if (!email) {
    return <Navigate to="/register" replace />;
  }

  return (
    <main className="relative flex min-h-dvh items-center overflow-hidden bg-background text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-border" />
        <div className="absolute left-[-10rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-md px-4 py-16 sm:px-6 lg:py-20">
        <VerifyOtpCard>
          <VerifyOtpHeader email={email} />
          <VerifyOtpForm email={email} />
        </VerifyOtpCard>
      </div>
    </main>
  );
}

