"use client";

import React, { useState, useEffect } from "react";
import { User, Briefcase } from "lucide-react";
import { getUserFromStorage } from "../utils/getUserFromCookies";

interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  joinedDate?: string;
  role?: string;
  profileImage?: string;
}

export default function ProfileSection() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser({
        name: `${storedUser.firstName} ${storedUser.lastName}`.trim(),
        email: storedUser.email,
        role: storedUser.role,
      });
    }
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600/40 via-orange-200/30 to-orange-200/600 p-8 text-center relative backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-white/80 shadow-xl mb-4 ring-4 ring-orange-400 flex items-center justify-center">
                <User className="w-15 h-15 text-white" />
              </div>

              <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">
                {user.name || "N/A"}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Personal Info */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-400" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <p className="text-white font-medium">{user.name}</p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm">Email Address</p>
                  <p className="text-white font-medium break-all">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Employment Info  */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-400" />
                Employment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm">Role</p>
                  <p className="text-white font-medium">
                    {user.role
                      ? user.role.charAt(0).toUpperCase() +
                        user.role.slice(1).toLowerCase()
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
