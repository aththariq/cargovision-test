"use client";

import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { signOut } = useAuth();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#12295F' }}>
        Dashboard
      </h1>
      <button
        onClick={signOut}
        className="px-4 py-2 rounded-md text-white font-medium"
        style={{ backgroundColor: '#2A8AFB' }}
      >
        Logout
      </button>
    </main>
  );
} 