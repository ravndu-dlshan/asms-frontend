"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Shield,
} from "lucide-react";
import Cookies from "js-cookie";

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badgeColor?: string;
}

interface UserProfile {
  name: string;
  role: string;
  avatar?: string;
}

interface SidebarProps {
  user?: UserProfile;
  onLogout?: () => void;
}

const DEFAULT_USER: UserProfile = {
  name: "Admin User",
  role: "Administrator",
};

const MENU_ITEMS: MenuItem[] = [
  {
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/admin/employees",
    icon: Users,
    label: "Employees",
  },
  {
    href: "/admin/work-orders",
    icon: Briefcase,
    label: "Work Orders",
  },
  {
    href: "/admin/settings",
    icon: Settings,
    label: "Settings",
  },
];

const SIDEBAR_CONFIG = {
  collapsedWidth: "w-20",
  expandedWidth: "w-64",
  brandName: "ASMS",
  brandSubtitle: "Admin Portal",
};

export default function AdminSidebar({
  user = DEFAULT_USER,
  onLogout,
}: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem("userInfo");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    Cookies.remove("authToken");

    if (onLogout) {
      onLogout();
    } else {
      router.push("/");
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${
        sidebarOpen ? SIDEBAR_CONFIG.expandedWidth : SIDEBAR_CONFIG.collapsedWidth
      } bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800 shadow-xl`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="text-lg font-bold text-white">{SIDEBAR_CONFIG.brandName}</h1>
              <p className="text-xs text-gray-400">{SIDEBAR_CONFIG.brandSubtitle}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-400 border border-orange-500/30"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {item.badgeColor && sidebarOpen && (
                <span className={`ml-auto w-2 h-2 rounded-full ${item.badgeColor}`} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

