import { motion } from "framer-motion";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FieldError } from "@/auth/shared/FieldError";
import { PasswordToggle } from "@/auth/shared/PasswordToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  REGISTER_FIELD_LABELS,
  REGISTER_FIELD_PLACEHOLDERS,
} from "@/constants/auth.constants";
import { useRegisterForm } from "@/hooks/useRegisterForm";

export function RegisterForm() {
  const { register, formState, isSubmitting, onSubmit } = useRegisterForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const errors = formState.errors;

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="fullName"
          className="text-sm font-medium text-foreground"
        >
          {REGISTER_FIELD_LABELS.fullName}
        </label>
        <div className="relative">
          <User
            size={16}
            strokeWidth={1.75}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder={REGISTER_FIELD_PLACEHOLDERS.fullName}
            invalid={Boolean(errors.fullName)}
            className="pl-11"
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            {...register("fullName")}
          />
        </div>
        <FieldError message={errors.fullName?.message} />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          {REGISTER_FIELD_LABELS.email}
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
            placeholder={REGISTER_FIELD_PLACEHOLDERS.email}
            invalid={Boolean(errors.email)}
            className="pl-11"
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          {REGISTER_FIELD_LABELS.password}
        </label>
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
            autoComplete="new-password"
            placeholder={REGISTER_FIELD_PLACEHOLDERS.password}
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

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-foreground"
        >
          {REGISTER_FIELD_LABELS.confirmPassword}
        </label>
        <div className="relative">
          <Lock
            size={16}
            strokeWidth={1.75}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={REGISTER_FIELD_PLACEHOLDERS.confirmPassword}
            invalid={Boolean(errors.confirmPassword)}
            className="pl-11 pr-12"
            aria-describedby={
              errors.confirmPassword ? "confirmPassword-error" : undefined
            }
            {...register("confirmPassword")}
          />
          <PasswordToggle
            showPassword={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((value) => !value)}
          />
        </div>
        <FieldError message={errors.confirmPassword?.message} />
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
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </motion.div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:text-primary/90"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
