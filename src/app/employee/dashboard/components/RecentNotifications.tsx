"use client";

import { Eye, Bell } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface RecentNotificationsProps {
  onViewAll: () => void;
  recentNotification: Notification | null;
}

// RecentNotifications component with recent notification
export default function RecentNotifications({ onViewAll, recentNotification }: RecentNotificationsProps) {
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-3 border border-gray-700 relative overflow-hidden">
      {/* Subtle orange gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5 pointer-events-none" />

      {/* Top orange accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      <div className="relative z-10">
        <h2 className="text-xl font-bold text-white mb-2">Recent Notifications</h2>
        
        {recentNotification ? (
          /* Recent Notification Section */
          <div className="p-3 bg-gray-700/50 rounded-xl border border-orange-500/20 hover:bg-gray-600/50 transition">
            <div className="flex justify-between items-start mb-2">
              <h5 className="text-xs font-medium text-gray-300">{recentNotification.title}</h5>
              {!recentNotification.read && (
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              )}
            </div>
            <p className="text-gray-400 text-xs mb-2 truncate">{recentNotification.message}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-500 text-xs">{recentNotification.time}</span>
              <button 
                onClick={onViewAll}
                className="flex items-center text-orange-400 hover:text-orange-300 text-xs transition cursor-pointer"
              >
                <Eye className="w-3 h-3 mr-1" />
                View All
              </button>
            </div>
          </div>
        ) : (
          /* No notifications message */
          <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600 text-center">
            <Bell className="w-6 h-6 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No recent notifications</p>
          </div>
        )}
      </div>

      {/* Bottom orange accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
    </div>
  );
}