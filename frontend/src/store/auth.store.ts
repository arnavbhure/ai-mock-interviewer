import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  is_verified: boolean;
  created_at: string;
}

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  isLoggedIn: false,

  setUser: (user) => {
    set({ user, isLoggedIn: true });
  },

  clearUser: () =>
    set({
      user: null,
      isLoggedIn: false,
    }),
}));
