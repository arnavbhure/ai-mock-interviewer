/* ==========================================================
   USER STORE — TYPE DEFINITIONS
   ========================================================== */

export interface User {
  id: string;
  name: string;
  email: string;
  is_verified: boolean;
  created_at: string;
}

export interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  isInitialized: boolean;

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  setInitialized: (initialized: boolean) => void;
}
