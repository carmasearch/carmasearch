import { create } from "zustand";

export type AuthModeStore = {
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
};

export const useAuthModeStore = create<AuthModeStore>((set) => ({
  authMode: "login",
  setAuthMode: (mode: "login" | "register") => set({ authMode: mode }),
}));
