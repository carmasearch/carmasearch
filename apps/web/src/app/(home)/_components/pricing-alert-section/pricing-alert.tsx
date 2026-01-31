"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthModeStore } from "@/global/store/auth.mode.store";
import { useAuthModelStore } from "@/global/store/auth.model.store";
import { useAuthStore } from "@/global/store/auth.store";
import { toast } from "sonner";

export default function PricingAlert() {
  const { setAuthMode } = useAuthModeStore((state) => state);
  const { setIsAuthModalOpen } = useAuthModelStore((state) => state);
  const { isAuthenticated } = useAuthStore((state) => state);
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter your email for price alerts..."
        className="flex-1"
      />
      <Button
        onClick={() => {
          if (!isAuthenticated) {
            setAuthMode("register");
            setIsAuthModalOpen(true);
          } else {
            toast("Subscribed!", {
              description: "You'll receive price alerts at your email.",
            });
          }
        }}
      >
        Subscribe
      </Button>
    </div>
  );
}
