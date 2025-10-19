"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  Package,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

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
  name: "John Smith",
  role: "Technician",
};

const MENU_ITEMS: MenuItem[] = [
  {
    href: "/employee/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/employee/upcoming-tasks",
    icon: ClipboardList,
    label: "Upcoming Tasks",
    badgeColor: "bg-orange-500",
  },
  {
    href: "/employee/work-log",
    icon: Clock,
    label: "Work Log & Time",
  },
  {
    href: "/employee/parts-request",
    icon: Package,
    label: "Part Requests",
    badgeColor: "bg-blue-500",
  },
];

const SIDEBAR_CONFIG = {
  collapsedWidth: "w-25",
  expandedWidth: "w-64",
  brandName: "Carvo",
  brandSubtitle: "Employee Portal",
};

export default function Sidebar({
  user = DEFAULT_USER,
  onLogout,
}: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/employee") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      console.log("Logout clicked");
      // Add your logout logic here
      // Example: router.push('/login');
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${
        sidebarOpen
          ? SIDEBAR_CONFIG.expandedWidth
          : SIDEBAR_CONFIG.collapsedWidth
      } bg-gray-900 border-r border-gray-800`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {sidebarOpen ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-2">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <div className="pl-2"> 
              <h2 className="text-2xl font-bold text-white">
                Car<span className="text-orange-500">vo</span>
              </h2>
              <p className="text-xs text-gray-400">
                {SIDEBAR_CONFIG.brandSubtitle}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* User Profile Section */}
      <div className={`p-4 border-b border-gray-800 ${!sidebarOpen ? "flex justify-center" : ""}`}>
        <div className={`flex ${sidebarOpen ? "items-center space-x-3" : "justify-center"}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                active
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              } ${sidebarOpen ? "justify-start space-x-3" : "justify-center"}`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className={`p-4 border-t border-gray-800 space-y-2 ${!sidebarOpen ? "flex justify-center" : ""}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center ${
            sidebarOpen ? "justify-start space-x-3 px-4 w-full" : "justify-center w-12 h-12"
          } py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors`}
          title={!sidebarOpen ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export type { MenuItem, UserProfile, SidebarProps };