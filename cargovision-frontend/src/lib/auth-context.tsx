"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginCredentials, RegisterData, AuthResponse, ApiResponse } from '@/lib/api';

interface User {
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  register: (data: RegisterData) => Promise<ApiResponse<AuthResponse>>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          // Try to refresh token to validate it's still valid
          try {
            const refreshResponse = await authService.refreshToken();
            if (refreshResponse.status === 'success') {
              // Token is valid, set user state
              // Note: We don't have email in stored token, so we'll need to decode it or store it separately
              // For now, we'll just mark as authenticated
              setUser({
                email: 'user@example.com', // Would need to store this or decode from JWT
                token: refreshResponse.data.token
              });
            }
          } catch {
            // Token is invalid, clear it
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.status === 'success') {
        setUser({
          email: response.data.email,
          token: response.data.token
        });
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      if (response.status === 'success') {
        setUser({
          email: response.data.email,
          token: response.data.token
        });
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 