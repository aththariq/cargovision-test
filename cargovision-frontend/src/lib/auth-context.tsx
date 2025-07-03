"use client";

import React from "react";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  signIn: (token: string, remember?: boolean) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // On mount, pull token from localStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("token");
      if (stored) {
        setToken(stored);
      }
    }
  }, []);

  const signIn = (newToken: string, remember = true) => {
    setToken(newToken);
    // Save to cookie for middleware
    document.cookie = `token=${newToken}; path=/; sameSite=lax`;
    if (remember) {
      localStorage.setItem("token", newToken);
    }
  };

  const signOut = () => {
    setToken(null);
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const value: AuthContextValue = {
    token,
    isAuthenticated: Boolean(token),
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
} 