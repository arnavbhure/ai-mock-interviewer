import { RegisterCard } from "@/auth/register/RegisterCard";
import { RegisterForm } from "@/auth/register/RegisterForm";
import { RegisterHeader } from "@/auth/register/RegisterHeader";
import { AuthBackground } from "@/auth/shared/AuthBackground";

export function RegisterPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background text-text px-4 py-12 sm:px-6 lg:px-8">
      <AuthBackground />

      <div className="relative w-full max-w-[440px]">
        <RegisterCard>
          <RegisterHeader />
          <RegisterForm />
        </RegisterCard>
      </div>
    </main>
  );
}
