"use client";

import { useAuth } from "@/lib/auth-context";
import { Sun, User, LogOut, Settings } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardHeader() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Mock user data - in real app this would come from context/state
  const user = {
    name: "John Doe",
    email: "john@example.com"
  };

  return (
    <div className="flex h-16 items-center px-4 justify-between w-full">
      {/* Mobile Sidebar Trigger */}
      <div className="lg:hidden">
        <SidebarTrigger />
      </div>
      
      {/* Header Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Dark Mode Toggle (placeholder for now) */}
        <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
          <Sun className="h-5 w-5" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors">
              <div className="h-8 w-8 rounded-full bg-[#12295F] text-white flex items-center justify-center text-sm font-medium">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="hidden md:block text-sm font-medium">{user.name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 