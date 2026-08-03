import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerFormSchema } from "@/constants/auth.constants";
import { createZodResolver } from "@/lib/zod-resolver";
import type { RegisterFormValues } from "@/types/auth.types";
import { register } from "@/api/auth/auth.api";
import { toastError, toastLoading, toastSuccess } from "@/components/ui/toast";

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

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    const toastId = toastLoading("Signing up...");

    try {
      const response = await register({
        name: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (!response.success) {
        toastError(response.message, {
          id: toastId,
        });
        return;
      }

      toastSuccess(response.message, {
        id: toastId,
      });

      navigate("/verify-otp", {
        state: {
          email: values.email,
        },
      });
    } catch (error) {
      console.error(error);

      toastError("Something went wrong. Please try again.", {
        id: toastId,
      });

      setSubmitError("Registration failed.");
    }
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
