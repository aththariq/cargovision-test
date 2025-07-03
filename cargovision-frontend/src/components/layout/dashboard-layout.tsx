"use client";

import { ReactNode, useState } from "react";
import SidebarNavigation from "./sidebar-navigation";
import DashboardHeader from "./dashboard-header";
import { Menu, X } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="flex h-16 items-center px-4 justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          
          {/* Logo/Brand - Hidden on mobile when sidebar is open */}
          <div className={`flex items-center gap-2 ${isSidebarOpen ? 'hidden' : 'flex'} lg:flex`}>
            <img src="/Icon.png" alt="CargoVision" className="h-8 w-8" />
            <span className="text-xl font-semibold text-[#12295F]">CargoVision</span>
          </div>
          
          <DashboardHeader />
        </div>
      </div>

      <div className="flex pt-16">
        {/* Sidebar Navigation */}
        <aside className={`
          fixed left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <SidebarNavigation />
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 