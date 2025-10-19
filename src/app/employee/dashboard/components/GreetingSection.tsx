"use client";

import Image from "next/image";
import { Activity, Bell, User } from "lucide-react";
import { useEffect, useState } from "react";

interface GreetingSectionProps {
  userName?: string;
  userImage?: string;
}

export default function GreetingSection({
  userName = "John Smith",
  userImage,
}: GreetingSectionProps) {
  const [name, setName] = useState(userName);
  const [image, setImage] = useState(userImage);

  // Fetch user details
  /*
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(''); // endpoint
        const data = await response.json();
        setName(data.name);
        setImage(data.image);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);
  */

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-800 flex flex-col md:flex-row items-center justify-between">
      {/* Left: Greeting + Overview */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {greeting}, {name}!
        </h1>
        <p className="text-gray-400">
          Welcome back! Here is your daily overview.
        </p>
      </div>

      {/* Right: Icons and Profile */}
      <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end space-y-4">
        {/* Middle Row: Notification Icon + Employee Profile */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <button
            type="button"
            aria-label="Notifications"
            className="w-12 h-12 cursor-pointer hover:bg-gray-600 transition rounded-xl flex items-center justify-center relative"
          >
            <Bell className="w-6 h-6 text-white" aria-hidden="true" />
            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Employee Profile */}
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 cursor-pointer rounded-full overflow-hidden border-2 border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
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
        </div>

        {/* Bottom Row: Current Time */}
        <div className="text-right">
          <p className="text-gray-400 text-sm">
            {currentDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
