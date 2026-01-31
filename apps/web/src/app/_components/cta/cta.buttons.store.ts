import { create } from "zustand";

export type CtaButtonsStore = {
  handleCompareClick: () => void;
  handlePriceAlertsClick: () => void;
};

export const ctaButtonsStore = create<CtaButtonsStore>((set) => ({
  handleCompareClick: () => set({}),
  handlePriceAlertsClick: () => set({}),
}));
