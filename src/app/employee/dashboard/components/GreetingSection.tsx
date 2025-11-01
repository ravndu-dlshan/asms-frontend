"use client";

import { Bell, User } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserFromStorage } from "../../utils/getUserFromCookies";
import Link from "next/link";
import NotificationPanel from "./NotificationPanel";
import StatCard from "./StatCard";
import QuickActions from "./QuickAccess";
import Image from "next/image";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface GreetingSectionProps {
  userImage?: string;
}

export default function GreetingSection({ userImage }: GreetingSectionProps) {
  const [name, setName] = useState("User");
  const [image] = useState(userImage);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const user = getUserFromStorage();
    if (user?.firstName) setName(user.firstName);
  }, []);

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";
      
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: "New Job Assigned",
        message: 'A new job "Server Maintenance" has been assigned to you.',
        time: "2 hours ago",
        read: false,
      },
      {
        id: 2,
        title: "Deadline Reminder",
        message: "The Mobile App Redesign project deadline is tomorrow.",
        time: "5 hours ago",
        read: true,
      },
    ]);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start w-full">
      {/* Greeting Card + Stats */}
      <div className="w-full lg:flex-1">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xl sm:text-xl lg:text-[26px] font-bold text-white mb-2">
              {greeting}, {name}!
            </p>
            <p className="text-sm sm:text-base text-gray-400">
              Welcome back! Here is your daily overview.
            </p>
          </div>
        </div>
        <StatCard />
      </div>

      {/* Car Image Card */}
      <div className="w-full lg:flex-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-3 border border-gray-700 flex flex-col items-center">
        <div className="relative w-full max-w-md">
          <Image
            src="/suvCar.png"
            alt="SUV car"
            width={600}
            height={400}
            className="object-contain p-3 mt-4 sm:mt-6 w-full h-auto"
            priority
          />
        </div>
        <div className="relative z-10 text-center mt-4 sm:mt-6">
          <p className="text-2xl sm:text-3xl font-bold text-white">
            Car<span className="text-orange-500">vo</span>
          </p>
          <div className="mt-3">
            <p className="text-white text-base sm:text-lg font-semibold">
              {currentDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-gray-400 text-xs lg:mb-5">
              {currentDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Profile + Notification Card */}
      <div className="w-full lg:flex-1 relative">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700 flex flex-col justify-between relative">
          <div className="flex items-center justify-end space-x-4 relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-12 h-12 cursor-pointer hover:bg-gray-700/50 hover:border-orange-500/40 border border-gray-700/30 transition rounded-xl flex items-center justify-center relative"
            >
              <Bell className="w-6 h-6 text-white" aria-hidden="true" />
              <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            <Link href="/employee/profile">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  {image ? (
                    <Image
                      src={image}
                      alt={`${name} profile`}
                      width={48}
                      height={48}
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-6 h-6 text-white" aria-hidden="true" />
                  )}
                </div>
                <div className="text-white">
                  <p className="font-semibold text-sm sm:text-base">{name}</p>
                  <p className="text-xs sm:text-sm text-gray-400">Employee</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {showNotifications && (
          <div className="fixed sm:absolute top-0 right-0 z-50 w-full sm:w-auto">
            <NotificationPanel
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </div>
        )}

        <div className="mt-5">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}