// src/app/employee/components/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  Package,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Wrench,
  FileText,
  BarChart3
} from 'lucide-react';


interface MenuItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
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
  name: 'John Smith',
  role: 'Technician',
};

// Menu items configuration - ADD/REMOVE/EDIT ITEMS HERE
const MENU_ITEMS: MenuItem[] = [
  {
    href: '/employee',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/employee/upcoming-tasks',
    icon: ClipboardList,
    label: 'Upcoming Tasks',
    badge: 5,
    badgeColor: 'bg-orange-500'
  },
  {
    href: '/employee/work-log',
    icon: Clock,
    label: 'Work Log & Time',
  },
  {
    href: '/employee/parts-request',
    icon: Package,
    label: 'Part Requests',
    badge: 2,
    badgeColor: 'bg-blue-500'
  },
  
];

const SIDEBAR_CONFIG = {
  collapsedWidth: 'w-20',
  expandedWidth: 'w-64',
  brandName: 'Carvo',
  brandSubtitle: 'Employee Portal',
};

export default function Sidebar({ user = DEFAULT_USER, onLogout }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/employee') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      console.log('Logout clicked');
      // Add your logout logic here
      // Example: router.push('/login');
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${
        sidebarOpen ? SIDEBAR_CONFIG.expandedWidth : SIDEBAR_CONFIG.collapsedWidth
      } bg-gray-900 border-r border-gray-800`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {sidebarOpen ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{SIDEBAR_CONFIG.brandName}</h1>
              <p className="text-xs text-gray-400">{SIDEBAR_CONFIG.brandSubtitle}</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto">
            <Settings className="w-6 h-6 text-white" />
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
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
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                active
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto ${item.badgeColor || 'bg-orange-500'} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {!sidebarOpen && item.badge && (
                <span className={`absolute -top-1 -right-1 ${item.badgeColor || 'bg-orange-500'} text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <button
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title={!sidebarOpen ? 'Notifications' : undefined}
        >
          <Bell className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Notifications</span>}
          {!sidebarOpen && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        <button
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title={!sidebarOpen ? 'Settings' : undefined}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Settings</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
          title={!sidebarOpen ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}


export type { MenuItem, UserProfile, SidebarProps };