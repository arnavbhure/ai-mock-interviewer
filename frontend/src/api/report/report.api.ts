import api from "../axios";
import type { ReportData } from "@/types/report.types";

interface ReportApiResponse {
  success: boolean;
  message?: string;
  data: ReportData;
}

/**
 * Fetches the performance report for a specific interview or the user's latest completed interview.
 * Endpoint: GET /api/reports?interviewId=...
 */
export async function getReportData(interviewId?: string): Promise<ReportData> {
  const response = await api.get<ReportApiResponse>("/reports", {
    params: interviewId ? { interviewId } : undefined,
  });

  return response.data?.data;
}

