import { motion } from "framer-motion";
import { Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RememberMe } from "@/auth/login/RememberMe";
import { FieldError } from "@/auth/shared/FieldError";
import { PasswordToggle } from "@/auth/shared/PasswordToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LOGIN_FIELD_LABELS,
  LOGIN_FIELD_PLACEHOLDERS,
} from "@/constants/auth.constants";
import { useLoginForm } from "@/hooks/useLoginForm";

export function LoginForm() {
  const { register, formState, isSubmitting, onSubmit } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);
  const errors = formState.errors;

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          {LOGIN_FIELD_LABELS.email}
        </label>
        <div className="relative">
          <Mail
            size={16}
            strokeWidth={1.75}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={LOGIN_FIELD_PLACEHOLDERS.email}
            invalid={Boolean(errors.email)}
            className="pl-11"
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            {LOGIN_FIELD_LABELS.password}
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary hover:text-primary/90"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock
            size={16}
            strokeWidth={1.75}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder={LOGIN_FIELD_PLACEHOLDERS.password}
            invalid={Boolean(errors.password)}
            className="pl-11 pr-12"
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          <PasswordToggle
            showPassword={showPassword}
            onToggle={() => setShowPassword((value) => !value)}
          />
        </div>
        <FieldError message={errors.password?.message} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <RememberMe register={register} />
      </div>

      <motion.div whileTap={{ scale: 0.995 }} transition={{ duration: 0.15 }}>
        <Button
          type="submit"
          variant="primary"
          className="h-12 w-full gap-2 text-sm font-medium shadow-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} strokeWidth={1.75} className="animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </motion.div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-primary hover:text-primary/90"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
