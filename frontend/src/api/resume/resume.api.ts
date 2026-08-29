import api from "../axios";

export interface ResumeUploadResponse {
  success: boolean;
  message: string;
  resumeId?: string;
  [key: string]: unknown;
}

/**
 * Uploads the candidate's resume PDF via multipart/form-data to the backend.
 * The backend handles PDF extraction, chunking, embeddings, and structured storage.
 *
 * @param file - The resume PDF File object
 * @returns Promise resolving to ResumeUploadResponse
 */
export async function uploadResume(file: File): Promise<ResumeUploadResponse> {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await api.post<ResumeUploadResponse>("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    skipErrorToast: true,
  });

  return response.data;
}

export default uploadResume;
