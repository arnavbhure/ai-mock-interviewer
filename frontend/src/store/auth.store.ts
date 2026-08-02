import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  is_verified : boolean;
  created_at: string;
}

interface AuthStore {
  user: User | null;

  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) =>({
    user : null , 
    
    setUser : (user) =>{
        set({user})
    },

    clearUser: () =>
    set({
      user: null,
    }),
}))