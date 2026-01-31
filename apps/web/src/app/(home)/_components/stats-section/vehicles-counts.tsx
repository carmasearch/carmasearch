"use client";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { vehicleStore } from "@/global/store/vehicle.store";

export default function VehiclesCounts() {
  const { vehicleCount } = vehicleStore((state) => state);
  return (
    <div className="text-3xl font-bold text-primary mb-2">
      <AnimatedCounter target={vehicleCount} />
    </div>
  );
}
