import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import type { DashboardFormValues } from "@/types/dashboard.types";
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from "@/types/dashboard.types";
import { createInterview } from "@/api/auth/auth.api";
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from "@/components/ui/toast";

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string; detail?: string }
      | string
      | undefined;

    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object") {
      if (typeof data.message === "string" && data.message.trim()) return data.message;
      if (typeof data.error === "string" && data.error.trim()) return data.error;
      if (typeof data.detail === "string" && data.detail.trim()) return data.detail;
    }

    if (error.message) return error.message;
  }

  if (error instanceof Error && error.message) return error.message;
  return "Failed to create interview. Please try again.";
}

export function useDashboardForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DashboardFormValues>({
    defaultValues: {
      role: "",
      resume: null,
      difficulty: null,
    },
    mode: "onTouched",
  });

  const watchedRole = form.watch("role");
  const watchedDifficulty = form.watch("difficulty");
  const watchedResume = form.watch("resume");

  const isFormValid =
    Boolean(watchedRole?.trim()) &&
    watchedResume !== null &&
    watchedDifficulty !== null;

  const handleFileChange = (file: File | null) => {
    if (!file) {
      form.setValue("resume", null, { shouldValidate: true, shouldDirty: true });
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith(".pdf")) {
      toastError("Please upload a PDF resume.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toastError("File size exceeds 10MB. Please choose a smaller PDF.");
      return;
    }

    form.setValue("resume", file, { shouldValidate: true, shouldDirty: true });
  };

  const removeFile = () => {
    form.setValue("resume", null, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (isSubmitting) return;

    const role = values.role.trim();
    if (!role) {
      toastError("Please enter a target role.");
      return;
    }
    if (!values.resume) {
      toastError("Please upload your resume.");
      return;
    }
    if (!values.difficulty) {
      toastError("Please select a difficulty level.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toastLoading("Preparing Interview...");

    try {
      const response = await createInterview({
        role,
        difficulty: values.difficulty,
        resume: values.resume,
      });

      toastDismiss(toastId);

      if (!response.success) {
        toastError(response.message || "Failed to create interview. Please try again.");
        return;
      }

      toastSuccess(response.message || "Interview ready.");
    } catch (error) {
      toastError(getApiErrorMessage(error), { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  });

  const getCompletionCount = () => {
    let count = 0;
    if (watchedRole?.trim()) count += 1;
    if (watchedResume !== null) count += 1;
    if (watchedDifficulty !== null) count += 1;
    return count;
  };

  return {
    form,
    isSubmitting,
    handleFileChange,
    removeFile,
    onSubmit,
    isFormValid,
    getCompletionCount,
    watchedRole,
    watchedDifficulty,
    watchedResume,
  };
}
