import { LoginCard } from "@/auth/login/LoginCard";
import { LoginForm } from "@/auth/login/LoginForm";
import { LoginHeader } from "@/auth/login/LoginHeader";
import { LoginPreview } from "@/auth/login/LoginPreview";
import { AuthBackground } from "@/auth/shared/AuthBackground";

export function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center overflow-hidden bg-background text-foreground">
      <AuthBackground />

      <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[3fr_2fr] lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20">
        <section className="mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
          <LoginCard>
            <LoginHeader />
            <LoginForm />
          </LoginCard>
        </section>

        <section className="hidden md:block md:justify-self-start md:w-full md:max-w-xl lg:max-w-2xl">
          <LoginPreview />
        </section>
      </div>
    </main>
  );
}
