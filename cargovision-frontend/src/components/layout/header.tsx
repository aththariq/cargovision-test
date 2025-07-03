"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import type { NavigationItem } from "@/types";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";
      
      if (scrollY < 10) {
        // Always show when at top
        setIsScrolled(false);
      } else if (direction === "down" && scrollY > lastScrollY + 10) {
        // Hide when scrolling down
        setIsScrolled(true);
      } else if (direction === "up" && scrollY < lastScrollY - 10) {
        // Show when scrolling up
        setIsScrolled(false);
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);

    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, []);

  const navigationItems: NavigationItem[] = [
    { name: "Home", href: "/" },
    { name: "Milestones", href: "/milestones" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl bg-white border border-gray-200 rounded-full transition-transform duration-300 shadow-sm ${
      isScrolled ? '-translate-y-20' : 'translate-y-0'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Image
                src="/icon0.svg"
                alt="Cargovision Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">Cargovision</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.name}
                  {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
                
                {/* Dropdown Menu */}
                {item.hasDropdown && item.subItems && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-[#122960] hover:bg-[#122960]/10">
                Sign In
              </Button>
            </Link>
            <Link href="/get-started">
              <Button className="bg-[#122960] text-white hover:bg-[#122960]/90">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-900 p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-primary hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.hasDropdown && item.subItems && (
                    <div className="ml-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-primary/80 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Action Buttons */}
              <div className="px-4 pt-4 space-y-3 border-t border-gray-200">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-primary hover:bg-primary/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/get-started" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-primary text-white hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 