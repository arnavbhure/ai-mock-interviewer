import api from "../axios";
import type { ProgressApiResponse, ProgressData } from "@/types/progress.types";

/**
 * Fetches skill mastery and longitudinal progression analytics for the authenticated candidate.
 * Endpoint: GET /api/progress
 */
export async function getProgressData(): Promise<ProgressData> {
  const response = await api.get<ProgressApiResponse>("/progress");
  return response.data?.data;
}

