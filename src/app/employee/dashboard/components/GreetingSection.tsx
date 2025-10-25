"use client";

import { Bell, User } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import NotificationPanel from "./NotificationPanel";
import StatCard from "./StatCard";
import QuickActions from "./QuickAccess";
import RecentNotifications from "./RecentNotifications";
import Image from "next/image";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface GreetingSectionProps {
  userName?: string;
  userImage?: string;
}

export default function GreetingSection({
  userName = "John Smith",
  userImage,
}: GreetingSectionProps) {
  const [name] = useState(userName);
  const [image] = useState(userImage);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  // Get most recent notification
  const recentNotification = notifications.length > 0 ? notifications[0] : null;

  // Fetch notifications (same as in NotificationPanel)
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: 'New Job Assigned',
        message: 'A new job "Server Maintenance" has been assigned to you.',
        time: '2 hours ago',
        read: false,
      },
      {
        id: 2,
        title: 'Deadline Reminder',
        message: 'The Mobile App Redesign project deadline is tomorrow.',
        time: '5 hours ago',
        read: true,
      },
    ]);
  }, []);

  const handleViewAllNotifications = () => {
    setShowNotifications(true);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap gap-5 items-start w-full">
      {/* Greeting Card */}
      <div>
        <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle orange gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5 pointer-events-none" />

          {/* Top orange accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

          <div className="relative z-10">
            <h2 className="text-[30px] md:text-[32px] font-bold text-white mb-2">
              {greeting}, {name}!
            </h2>
            <p className="text-gray-400">
              Welcome back! Here is your daily overview.
            </p>
          </div>

          {/* Bottom orange accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
        </div>
        <StatCard />
      </div>

      {/* Car Image Card */}
      <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-3 border border-gray-700 flex flex-col items-center justify-start relative overflow-hidden">
        {/* Subtle orange gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5 pointer-events-none" />

        {/* Top orange accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

        {/* Car Image */}
        <div className="relative">
          <Image
            src="/suvCar.png"
            alt="Car"
            width={400}
            height={0}
            className="object-contain p-3 mt-6"
          />
        </div>
        <div className="relative z-10 text-center lg:mt-8 lg:mb-6">
          <p className="text-3xl font-bold text-white">
            Car<span className="text-orange-500">vo</span>
          </p>
          {/* Time Display - moved below Carvo */}
          <div className="mt-3">
            <p className="text-white text-lg font-semibold">
              {currentDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-gray-400 text-xs">
              {currentDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Bottom orange accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      </div>

      {/* Profile + Notification Card */}
      <div className="relative">
        <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle orange gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5 pointer-events-none" />

          {/* Top orange accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

          <div className="flex flex-col items-center md:items-end space-y-4 relative z-10">
            <div className="flex items-center space-x-4">
              {/*Notification Button */}
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-12 h-12 cursor-pointer hover:bg-gray-700/50 hover:border-orange-500/40 border border-gray-700/30 transition rounded-xl flex items-center justify-center relative"
              >
                <Bell className="w-6 h-6 text-white" aria-hidden="true" />
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></span>
              </button>

              {/* 👤 Profile Section */}
              <Link href="/employee/profile">
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        sizes="48px"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="text-white">
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-gray-400">Employee</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Bottom orange accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
        </div>

        {/* 🔹 Notification Panel - positioned absolutely relative to parent */}
        {showNotifications && (
          <div className="absolute top-0 right-0 z-50">
            <NotificationPanel 
              onClose={handleCloseNotifications} 
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </div>
        )}

        <div className="mt-5">
          <QuickActions />
        </div>
        
        {/* Recent Notifications Component */}
        {recentNotification && (
          <div className="mt-5">
            <RecentNotifications 
              onViewAll={handleViewAllNotifications}
              recentNotification={recentNotification}
            />
          </div>
        )}
      </div>
    </div>
  );
}