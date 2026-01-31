import { create } from "zustand";

export type HeaderStore = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
};

export const useHeaderStore = create<HeaderStore>((set) => ({
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: (open: boolean) => set({ isMobileMenuOpen: open }),
}));
