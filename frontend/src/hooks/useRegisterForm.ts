import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerFormSchema } from "@/constants/auth.constants";
import { createZodResolver } from "@/lib/zod-resolver";
import type { RegisterFormValues } from "@/types/auth.types";

const registerResolver = createZodResolver(registerFormSchema);

export function useRegisterForm() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: registerResolver,
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async () => {
    setSubmitError(null);

    // Simulate a short network round-trip.
    // TODO: Replace with the real auth API call.
    await new Promise((resolve) => window.setTimeout(resolve, 900));

    navigate("/dashboard");
  });

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    watch: form.watch,
    setValue: form.setValue,
    formState: form.formState,
    isSubmitting,
    submitError,
    onSubmit,
  };
}

