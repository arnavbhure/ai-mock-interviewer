import { LoginCard } from "@/auth/login/LoginCard";
import { LoginForm } from "@/auth/login/LoginForm";
import { LoginHeader } from "@/auth/login/LoginHeader";
import { AuthBackground } from "@/auth/shared/AuthBackground";

export function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background text-text px-4 py-12 sm:px-6 lg:px-8">
      <AuthBackground />

      <div className="relative w-full max-w-[440px]">
        <LoginCard>
          <LoginHeader />
          <LoginForm />
        </LoginCard>
      </div>
    </main>
  );
}
