import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { DashboardFormValues } from "@/types/dashboard.types";
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from "@/types/dashboard.types";
import { uploadResume } from "@/api/resume/resume.api";
import { createInterview } from "@/api/interview/interview.api";
import { useInterviewStore } from "@/store/interview.store";
import { invalidateAllApiCaches } from "@/store/api.store";
import { toastError } from "@/components/ui/toast";

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
  return "Failed to process resume. Please try again.";
}

function isApiSuccess(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") return true;
  const obj = payload as Record<string, unknown>;

  // Explicit failure flags
  if (obj.success === false) return false;
  if (obj.status === "error" || obj.status === "failed") return false;
  if (typeof obj.status === "number" && obj.status >= 400) return false;
  if (typeof obj.error === "string" && obj.error.trim()) return false;

  return true;
}

function extractId(payload: unknown, keys: string[]): string | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;

  // Check top-level keys
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return String(obj[key]);
    }
  }

  // Check inside nested data property
  if (obj.data && typeof obj.data === "object") {
    const nested = obj.data as Record<string, unknown>;
    for (const key of keys) {
      if (nested[key] !== undefined && nested[key] !== null) {
        return String(nested[key]);
      }
    }
  }

  return null;
}

export function useDashboardForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);

  const navigate = useNavigate();

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

  const executeResumeUpload = useCallback(
    async (file: File, role: string, difficulty: "easy" | "medium" | "hard") => {
      setIsSubmitting(true);
      setIsProcessingResume(true);
      setResumeError(null);

      // Reset any previous interview state & errors in Zustand store
      useInterviewStore.getState().initializeInterview({ status: "idle" });
      useInterviewStore.getState().setInterviewConfig({
        role,
        difficulty,
        resumeFileName: file.name,
      });

      try {
        // ── Step 1: Upload the resume ──
        const uploadResponse = await uploadResume(file);

        if (!isApiSuccess(uploadResponse)) {
          const uploadObj = uploadResponse as Record<string, unknown> | undefined;
          const errorMsg =
            typeof uploadObj?.message === "string" && uploadObj.message.trim()
              ? uploadObj.message
              : typeof uploadObj?.error === "string" && uploadObj.error.trim()
                ? uploadObj.error
                : "Failed to process resume.";

          setResumeError(errorMsg);
          toastError(errorMsg);
          setIsSubmitting(false);
          return;
        }

        // Store resume ID if present
        const resumeId = extractId(uploadResponse, ["resumeId", "resume_id", "id"]);
        if (resumeId) {
          useInterviewStore.getState().setInterviewConfig({
            resumeId,
          });
        }

        // ── Step 2: Create the interview plan ──
        try {
          const interviewResponse = await createInterview({ role, difficulty });

          if (!isApiSuccess(interviewResponse)) {
            const interviewObj = interviewResponse as Record<string, unknown> | undefined;
            const errorMsg =
              typeof interviewObj?.message === "string" && interviewObj.message.trim()
                ? interviewObj.message
                : typeof interviewObj?.error === "string" && interviewObj.error.trim()
                  ? interviewObj.error
                  : "Failed to create interview plan.";

            setResumeError(errorMsg);
            toastError(errorMsg);
            setIsSubmitting(false);
            return;
          }

          // Store the interview ID if returned
          const interviewId = extractId(interviewResponse, ["interview_id", "interviewId", "id"]);
          if (interviewId) {
            useInterviewStore.getState().initializeInterview({
              status: "idle",
              interviewId,
            });
          } else {
            useInterviewStore.getState().initializeInterview({ status: "idle" });
          }
        } catch (interviewError) {
          const errorMsg = getApiErrorMessage(interviewError);
          setResumeError(errorMsg);
          toastError(errorMsg);
          setIsSubmitting(false);
          return;
        }

        // ── Both steps succeeded — navigate to interview ──
        setResumeError(null);
        setIsSubmitting(false);
        setIsProcessingResume(false);

        invalidateAllApiCaches();
        navigate("/interview");
      } catch (error) {
        const errorMsg = getApiErrorMessage(error);
        setResumeError(errorMsg);
        toastError(errorMsg);
        setIsSubmitting(false);
      }
    },
    [navigate],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    if (isSubmitting || isProcessingResume) return;

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

    await executeResumeUpload(values.resume, role, values.difficulty);
  });

  const handleRetryUpload = useCallback(() => {
    const values = form.getValues();
    if (values.resume && values.role && values.difficulty) {
      executeResumeUpload(values.resume, values.role.trim(), values.difficulty);
    } else {
      setIsProcessingResume(false);
      setResumeError(null);
      setIsSubmitting(false);
    }
  }, [executeResumeUpload, form]);

  const handleBackToSetup = useCallback(() => {
    setIsProcessingResume(false);
    setResumeError(null);
    setIsSubmitting(false);
  }, []);

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
    isProcessingResume,
    resumeError,
    handleFileChange,
    removeFile,
    onSubmit,
    handleRetryUpload,
    handleBackToSetup,
    isFormValid,
    getCompletionCount,
    watchedRole,
    watchedDifficulty,
    watchedResume,
  };
}

export default useDashboardForm;
