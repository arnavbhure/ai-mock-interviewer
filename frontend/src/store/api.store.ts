export { useDashboardStore } from "./dashboard.store";
export { useInterviewHistoryStore } from "./interviewHistory.store";
export { useReportStore } from "./report.store";

import { useDashboardStore } from "./dashboard.store";
import { useInterviewHistoryStore } from "./interviewHistory.store";
import { useReportStore } from "./report.store";

/**
 * Invalidates cached data across dashboard, interview history, and reports.
 * Call this whenever an interview completes or changes state.
 */
export function invalidateAllApiCaches(): void {
  useDashboardStore.getState().invalidateDashboard();
  useInterviewHistoryStore.getState().invalidateHistory();
  useReportStore.getState().invalidateReports();
}

/**
 * Resets all cached data across all stores. Call on user logout.
 */
export function resetAllApiStores(): void {
  useDashboardStore.getState().reset();
  useInterviewHistoryStore.getState().reset();
  useReportStore.getState().reset();
}

