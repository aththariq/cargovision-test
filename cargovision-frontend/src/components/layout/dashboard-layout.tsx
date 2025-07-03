"use client";

import { ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import DashboardHeader from "./dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Dashboard Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <DashboardHeader />
        </header>
        
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 