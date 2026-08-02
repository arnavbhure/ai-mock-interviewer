import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerFormSchema } from "@/constants/auth.constants";
import { createZodResolver } from "@/lib/zod-resolver";
import type { RegisterFormValues } from "@/types/auth.types";
import { register } from "@/api/auth.api";
import { toast } from "sonner";

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

    const toastId = toast.loading("Signing up...");

    try {
      const response = await register({
        name: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (!response.success) {
        toast.error(response.message, {
          id: toastId,
        });
        return;
      }

      toast.success(response.message, {
        id: toastId,
      });

      navigate("/verify-otp");
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong. Please try again.", {
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
