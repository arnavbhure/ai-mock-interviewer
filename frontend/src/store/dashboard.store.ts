import { create } from "zustand";
import { getDashboardData } from "@/api/dashboard/dashboard.api";
import type { ParsedDashboardData } from "@/types/dashboard.types";

const STALE_TIME = 2 * 60 * 1000; // 2 minutes

interface DashboardState {
  data: ParsedDashboardData | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  fetchDashboardData: (force?: boolean) => Promise<ParsedDashboardData | null>;
  invalidateDashboard: () => void;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchDashboardData: async (force = false) => {
    const { data, lastFetched, isLoading } = get();
    const now = Date.now();

    // Cache hit: return cached data if fresh and not force-refreshing
    if (!force && data && lastFetched && now - lastFetched < STALE_TIME) {
      return data;
    }

    // Guard against duplicate concurrent in-flight requests
    if (isLoading) {
      return data;
    }

    try {
      // Only trigger full-screen loading skeleton if we don't have any cached data yet
      if (!data) {
        set({ isLoading: true, error: null });
      }

      const result = await getDashboardData();
      set({
        data: result,
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load dashboard data";
      set({ isLoading: false, error: msg });
      return data;
    }
  },

  invalidateDashboard: () => set({ lastFetched: null }),

  reset: () =>
    set({
      data: null,
      isLoading: false,
      error: null,
      lastFetched: null,
    }),
}));

