import { create } from "zustand";
import type { User, UserState } from "@/types/user.types";

export type { User, UserState };

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoggedIn: false,
  isInitialized: false,

  setUser: (user: User) =>
    set({
      user,
      isLoggedIn: true,
      isInitialized: true,
    }),

  clearUser: () =>
    set({
      user: null,
      isLoggedIn: false,
      isInitialized: true,
    }),

  setInitialized: (isInitialized: boolean) =>
    set({
      isInitialized,
    }),
}));

// Export useAuthStore as an alias for backward compatibility
export const useAuthStore = useUserStore;
