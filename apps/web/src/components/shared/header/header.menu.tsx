"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useHeaderStore } from "./header.store";
import { Menu, User } from "lucide-react";
import { useAuthStore } from "@/global/store/auth.store";
import Link from "next/link";
import { useAuthModeStore } from "@/global/store/auth.mode.store";
import { useAuthModelStore } from "@/global/store/auth.model.store";

export default function HeaderMenu() {
  const { setIsMobileMenuOpen } = useHeaderStore((state) => state);
  const { isAuthenticated } = useAuthStore((state) => state);
  const { setAuthMode } = useAuthModeStore((state) => state);
  const { setIsAuthModalOpen } = useAuthModelStore((state) => state);
  return (
    <React.Fragment>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Logo placeholder */}
      <div></div>

      {/* Auth button */}
      {isAuthenticated ? (
        <div className="flex items-center space-x-3">
          <span className="text-white/90">Welcome, name&email</span>
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Link href={"/settings"}>Settings</Link>
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => {
            setAuthMode("login");
            setIsAuthModalOpen(true);
          }}
          className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 rounded-[32px] shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        >
          <User className="h-4 w-4" />
          Sign In
        </Button>
      )}
    </React.Fragment>
  );
}
