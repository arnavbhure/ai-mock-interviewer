import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginFormSchema } from "@/constants/auth.constants";
import { createZodResolver } from "@/lib/zod-resolver";
import type { LoginFormValues } from "@/types/auth.types";
import { toast } from "sonner";
import { login } from "@/api/auth/auth.api";
import { useAuthStore } from "@/store/auth.store";

const loginResolver = createZodResolver(loginFormSchema);

export function useLoginForm() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
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
      const toastId = toast.loading("Logging in...", { duration: 2000 });

      const response = await login(values);
      toast.dismiss(toastId);

      if (!response.success) {
        toast.error(response.message, {
          id: toastId,
        });
        clearUser();
        return;
      }
      setUser(response.user);
      toast.success(response.message, {
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
