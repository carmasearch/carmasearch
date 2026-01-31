import { create } from "zustand";

export type AuthStore = {
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (authenticated: boolean) =>
    set({ isAuthenticated: authenticated }),
}));
