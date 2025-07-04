"use client";

import React from "react";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
}

interface AuthContextValue {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  signIn: (token: string, user: User, remember?: boolean) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // On mount, pull token and user from localStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // If user data is corrupted, clear it
          localStorage.removeItem("user");
        }
      }
    }
  }, []);

  const signIn = (newToken: string, userData: User, remember = true) => {
    setToken(newToken);
    setUser(userData);
    // Save to cookie for middleware
    document.cookie = `token=${newToken}; path=/; sameSite=lax`;
    if (remember) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const value: AuthContextValue = {
    token,
    user,
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