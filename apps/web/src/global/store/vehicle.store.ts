import { create } from "zustand";

export type VehicleStore = {
  vehicleCount: number;
  setVehicleCount: (count: number) => void;
};

export const vehicleStore = create<VehicleStore>((set) => ({
  vehicleCount: 1000, // TODO: need to be dynamic data
  setVehicleCount: (count: number) => set({ vehicleCount: count }),
}));
