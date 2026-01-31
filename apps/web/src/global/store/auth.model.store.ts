import { create } from "zustand";

export type AuthModelStore = {
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
};

export const useAuthModelStore = create<AuthModelStore>((set) => ({
  isAuthModalOpen: false,
  setIsAuthModalOpen: (open: boolean) => set({ isAuthModalOpen: open }),
}));
