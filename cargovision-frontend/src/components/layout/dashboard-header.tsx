"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Moon, Sun, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { signOut } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement actual dark mode logic
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <>
      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Dark/Light Mode Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="h-9 w-9 p-0"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="h-9 w-9 p-0 rounded-full"
          >
            <div className="h-8 w-8 rounded-full bg-[#2A8AFB] flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </Button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">User Account</p>
                <p className="text-xs text-gray-500">user@cargovision.app</p>
              </div>
              
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          )}
                 </div>
       </div>
     </>
   );
 } 