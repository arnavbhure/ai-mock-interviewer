import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { DashboardFormValues } from "@/types/dashboard.types";
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from "@/types/dashboard.types";
import { uploadResume } from "@/api/resume/resume.api";
import { createInterview } from "@/api/interview/interview.api";
import { useInterviewStore } from "@/store/interview.store";
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

      // Save role, difficulty and resume filename in Zustand store
      useInterviewStore.getState().setInterviewConfig({
        role,
        difficulty,
        resumeFileName: file.name,
      });

      try {
        // ── Step 1: Upload the resume ──
        const response = await uploadResume(file);

        // Normalize response object safely
        const rawData =
          response &&
          typeof response === "object" &&
          "data" in response &&
          typeof (response as Record<string, unknown>).data === "object"
            ? ((response as Record<string, unknown>).data as Record<string, unknown>)
            : (response as Record<string, unknown>);

        // Check if response indicates success
        const isSuccess =
          Boolean(rawData) &&
          (rawData.success === true ||
            rawData.status === 200 ||
            rawData.status === "success" ||
            rawData.status === "ok" ||
            (rawData.success !== false &&
              typeof rawData.message === "string" &&
              rawData.message.toLowerCase().includes("success")));

        if (!isSuccess) {
          // Handle explicit failure response from resume upload
          const errorMsg =
            typeof rawData?.message === "string" && rawData.message.trim()
              ? rawData.message
              : "Failed to process resume.";

          setResumeError(errorMsg);
          toastError(errorMsg);
          setIsSubmitting(false);
          return;
        }

        // If backend returns a resumeId, store it
        if (rawData.resumeId && typeof rawData.resumeId === "string") {
          useInterviewStore.getState().setInterviewConfig({
            resumeId: rawData.resumeId,
          });
        }

        // ── Step 2: Create the interview plan ──
        try {
          const interviewResponse = await createInterview({ role, difficulty });

          const interviewData =
            interviewResponse &&
            typeof interviewResponse === "object" &&
            "data" in interviewResponse &&
            typeof (interviewResponse as Record<string, unknown>).data === "object"
              ? ((interviewResponse as Record<string, unknown>).data as Record<string, unknown>)
              : (interviewResponse as Record<string, unknown>);

          const isInterviewSuccess =
            Boolean(interviewData) &&
            (interviewData.success === true ||
              (interviewData.success !== false &&
                typeof interviewData.message === "string" &&
                interviewData.message.toLowerCase().includes("success")));

          if (!isInterviewSuccess) {
            const errorMsg =
              typeof interviewData?.message === "string" && interviewData.message.trim()
                ? interviewData.message
                : "Failed to create interview plan.";

            setResumeError(errorMsg);
            toastError(errorMsg);
            setIsSubmitting(false);
            return;
          }

          // Store the interview ID if returned
          if (
            interviewData.data &&
            typeof interviewData.data === "object" &&
            typeof (interviewData.data as Record<string, unknown>).interview_id === "string"
          ) {
            useInterviewStore.getState().initializeInterview({
              status: "idle",
              interviewId: (interviewData.data as Record<string, unknown>).interview_id as string,
            });
          } else {
            // Reset interview status so InterviewRoom starts clean
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
        setIsProcessingResume(false);
        setIsSubmitting(false);
        setResumeError(null);

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
