import { create } from "zustand";
import { getReportData } from "@/api/report/report.api";
import type { ReportData } from "@/types/report.types";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

interface CachedReport {
  data: ReportData;
  fetchedAt: number;
}

interface ReportState {
  reportsById: Record<string, CachedReport>;
  data: ReportData | null;
  activeInterviewId: string | undefined;
  isLoading: boolean;
  error: string | null;

  fetchReport: (interviewId?: string, force?: boolean) => Promise<ReportData | null>;
  invalidateReports: () => void;
  reset: () => void;
}

export const useReportStore = create<ReportState>((set, get) => ({
  reportsById: {},
  data: null,
  activeInterviewId: undefined,
  isLoading: false,
  error: null,

  fetchReport: async (interviewId?: string, force = false) => {
    const { reportsById, isLoading } = get();
    const cacheKey = interviewId || "latest";
    const cached = reportsById[cacheKey];
    const now = Date.now();

    // Cache hit: immediately switch to cached report without network request
    if (!force && cached && now - cached.fetchedAt < STALE_TIME) {
      set({
        data: cached.data,
        activeInterviewId: interviewId || cached.data.interview?.id,
        isLoading: false,
        error: null,
      });
      return cached.data;
    }

    if (isLoading) {
      return cached?.data || null;
    }

    try {
      // Only show full skeleton loader if this report isn't already cached
      if (!cached) {
        set({ isLoading: true, error: null });
      }

      const result = await getReportData(interviewId);
      const updatedCache = { ...get().reportsById };

      // Cache under the requested key
      updatedCache[cacheKey] = {
        data: result,
        fetchedAt: Date.now(),
      };

      // Also index under the interview ID if "latest" was requested and returned an ID
      if (result?.interview?.id && cacheKey === "latest") {
        updatedCache[result.interview.id] = {
          data: result,
          fetchedAt: Date.now(),
        };
      }

      set({
        reportsById: updatedCache,
        data: result,
        activeInterviewId: interviewId || result?.interview?.id,
        isLoading: false,
        error: null,
      });

      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load report data";
      set({ isLoading: false, error: msg });
      return null;
    }
  },

  invalidateReports: () =>
    set({
      reportsById: {},
    }),

  reset: () =>
    set({
      reportsById: {},
      data: null,
      activeInterviewId: undefined,
      isLoading: false,
      error: null,
    }),
}));

