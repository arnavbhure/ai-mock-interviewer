import { create } from "zustand";
import { getProgressData } from "@/api/progress/progress.api";
import type { ProgressData } from "@/types/progress.types";

const STALE_TIME = 2 * 60 * 1000; // 2 minutes

interface ProgressStoreState {
  data: ProgressData | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  fetchProgress: (force?: boolean) => Promise<ProgressData | null>;
  invalidateProgress: () => void;
  reset: () => void;
}

export const useProgressStore = create<ProgressStoreState>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchProgress: async (force = false) => {
    const { data, lastFetched, isLoading } = get();
    const now = Date.now();

    // Cache hit: return cached progression if fresh and not forced
    if (!force && data && lastFetched && now - lastFetched < STALE_TIME) {
      return data;
    }

    if (isLoading) {
      return data;
    }

    try {
      if (!data) {
        set({ isLoading: true, error: null });
      }

      const result = await getProgressData();
      set({
        data: result,
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load progress data";
      set({ isLoading: false, error: msg });
      return data;
    }
  },

  invalidateProgress: () => set({ lastFetched: null }),

  reset: () =>
    set({
      data: null,
      isLoading: false,
      error: null,
      lastFetched: null,
    }),
}));

