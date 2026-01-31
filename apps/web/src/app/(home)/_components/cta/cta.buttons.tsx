"use client";
import { Button } from "@/components/ui/button";
import { useStore } from "zustand";
import { ctaButtonsStore } from "./cta.buttons.store";

export default function CtaButtons() {
  const { handleCompareClick, handlePriceAlertsClick } =
    useStore(ctaButtonsStore);
  return (
    <>
      <Button
        size="lg"
        onClick={handleCompareClick}
        className="text-lg px-8 py-3"
      >
        Compare Vehicles
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="text-lg px-8 py-3"
        onClick={handlePriceAlertsClick}
      >
        Price Alerts
      </Button>
    </>
  );
}
