"use client";

import { create } from 'zustand';
import { User } from '@/types';

interface AppState {
  user: User | null;
  isLoading: boolean;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
}

interface AppActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

type AppStore = AppState & AppActions;

const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  theme: 'light',
  sidebarOpen: false,
  notifications: [],

  // Actions
  setUser: (user) => set({ user }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setTheme: (theme) => set({ theme }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  
  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));

    // Auto remove notification after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration || 5000);
    }
  },
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearNotifications: () => set({ notifications: [] }),
}));

export default useAppStore; 