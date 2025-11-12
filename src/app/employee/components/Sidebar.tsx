"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
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
import { getUserFromStorage } from "../utils/getUserFromCookies";

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badgeColor?: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { href: "/employee/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/employee/upcoming-tasks", icon: ClipboardList, label: "Upcoming Tasks" },
  { href: "/employee/work-log", icon: Clock, label: "Work Log & Time" },
  { href: "/employee/parts-request", icon: Package, label: "Part Requests" },
];

const SIDEBAR_CONFIG = {
  collapsedWidth: "w-20",
  expandedWidth: "w-64",
  brandSubtitle: "Employee Portal",
};

const LogoIcon = () => (
  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load user from cookies
  useEffect(() => {
    const userData = getUserFromStorage();
    setCurrentUser(userData || null);
    setLoading(false);
  }, []);

  // Collapse sidebar on smaller screens
  useEffect(() => {
    const updateSidebar = () =>
      setSidebarOpen(window.innerWidth >= 1024);
    updateSidebar();
    window.addEventListener("resize", updateSidebar);
    return () => window.removeEventListener("resize", updateSidebar);
  }, []);

  // Auto select dashboard if URL is /employee
  const activePath = useMemo(() => {
    return pathname === "/employee" ? "/employee/dashboard" : pathname;
  }, [pathname]);

  const handleLogout = () => {
    // Clear all auth cookies
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie =
      "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie =
      "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // Keep for backward compatibility
    document.cookie =
      "userInfo=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie =
      "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/");
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${
        sidebarOpen ? SIDEBAR_CONFIG.expandedWidth : SIDEBAR_CONFIG.collapsedWidth
      } bg-gray-900 border-r border-gray-800`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {sidebarOpen ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-2">
              <LogoIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Car<span className="text-orange-500">vo</span>
              </h2>
              <p className="text-xs text-gray-400">{SIDEBAR_CONFIG.brandSubtitle}</p>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <LogoIcon />
            </div>
          </div>
        )}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Profile */}
      <Link href="/employee/profile" className="p-4 border-b border-gray-800 hover:bg-gray-800/50 block">
        <div className={`flex ${sidebarOpen ? "items-center space-x-3" : "justify-center"}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {currentUser?.avatar ? (
              <Image
                src={currentUser.avatar}
                alt={`${currentUser.firstName} ${currentUser.lastName} profile image`}
                width={40}
                height={40}
                className="rounded-full object-cover"
                priority
                unoptimized
              />
            ) : (
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-full h-full flex items-center justify-center rounded-full">
                <User className="w-5 h-5 text-white" aria-label="User icon" />
              </div>
            )}
          </div>

          {sidebarOpen && (
            <div className="overflow-hidden">
              {loading ? (
                <>
                  <div className="h-4 bg-gray-700 rounded w-20 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-700 rounded w-16 animate-pulse"></div>
                </>
              ) : currentUser ? (
                <p className="text-sm font-semibold text-white truncate">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
              ) : (
                <>
                  <p className="text-sm text-white">User Not Found</p>
                  <p className="text-xs text-gray-400">Please log in</p>
                </>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {MENU_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = activePath.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                active
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              } ${sidebarOpen ? "space-x-3" : "justify-center"}`}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className={`flex items-center cursor-pointer ${
            sidebarOpen ? "space-x-3 px-4 w-full" : "justify-center w-12 h-12"
          } py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg`}
        >
          <LogOut className="w-5 h-5" aria-label="Logout icon" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}