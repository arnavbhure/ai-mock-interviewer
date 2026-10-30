import { create } from "zustand";
import { getInterviewHistory, type HistoryInterviewItem } from "@/api/interview/history.api";

const STALE_TIME = 2 * 60 * 1000; // 2 minutes

interface InterviewHistoryState {
  interviews: HistoryInterviewItem[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  fetchInterviews: (force?: boolean) => Promise<HistoryInterviewItem[]>;
  invalidateHistory: () => void;
  reset: () => void;
}

export const useInterviewHistoryStore = create<InterviewHistoryState>((set, get) => ({
  interviews: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchInterviews: async (force = false) => {
    const { interviews, lastFetched, isLoading } = get();
    const now = Date.now();

    // Cache hit: return existing data if not force-refreshing and within stale threshold
    if (!force && lastFetched && now - lastFetched < STALE_TIME) {
      return interviews;
    }

    // Prevent duplicate in-flight requests
    if (isLoading) {
      return interviews;
    }

    try {
      if (interviews.length === 0) {
        set({ isLoading: true, error: null });
      }

      const result = await getInterviewHistory();
      set({
        interviews: result,
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load interview history";
      set({ isLoading: false, error: msg });
      return interviews;
    }
  },

  invalidateHistory: () => set({ lastFetched: null }),

  reset: () =>
    set({
      interviews: [],
      isLoading: false,
      error: null,
      lastFetched: null,
    }),
}));

