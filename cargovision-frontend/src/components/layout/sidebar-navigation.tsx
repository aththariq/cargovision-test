"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Container, 
  FileText, 
  BarChart3, 
  MessageCircle,
  Home 
} from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Containers",
    href: "/dashboard/containers",
    icon: Container,
  },
  {
    name: "Reports", 
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics", 
    icon: BarChart3,
  },
  {
    name: "Chat",
    href: "/dashboard/chat",
    icon: MessageCircle,
  },
];

export default function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <nav className="h-full px-3 py-4">
      <div className="space-y-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? "bg-[#2A8AFB] text-white" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#2A8AFB]"
                }
              `}
            >
              <IconComponent className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 