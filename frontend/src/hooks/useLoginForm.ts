import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginFormSchema } from "@/constants/auth.constants";
import { createZodResolver } from "@/lib/zod-resolver";
import type { LoginFormValues } from "@/types/auth.types";
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from "@/components/ui/toast";
import { login } from "@/api/auth/auth.api";
import { useUserStore } from "@/store/user.store";

const loginResolver = createZodResolver(loginFormSchema);

export function useLoginForm() {
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: loginResolver,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onTouched",
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const toastId = toastLoading("Logging in...");

      const response = await login(values);
      toastDismiss(toastId);

      if (!response.success) {
        toastError(response.message, {
          id: toastId,
        });
        clearUser();
        return;
      }
      setUser(response.user);
      toastSuccess(response.message, {
        id: toastId,
      });
      navigate("/dashboard");
    } catch (error) {
      setSubmitError("Invalid email or password");
      console.error(error);
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
