'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Mail, Phone, MapPin, CalendarDays, Briefcase, Award, Star, Cake } from 'lucide-react';
import { clearAuthCookies, getUserInfo } from '@/app/lib/cookies';

interface UserProfile {
  name: string;
  position?: string;
  email: string;
  phone?: string;
  department?: string;
  address?: string;
  dateOfBirth?: string;
  joinedDate?: string;
  experience?: string;
  talentedAreas?: string[];
  profileImage?: string;
}

export default function ProfileSection() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedInfo = getUserInfo();
    if (!storedInfo) {
      setUser(null);
      return;
    }

    const fullName = `${storedInfo.firstName ?? ''} ${storedInfo.lastName ?? ''}`.trim() || storedInfo.email;
    const roleLabel = storedInfo.role ? storedInfo.role.charAt(0) + storedInfo.role.slice(1).toLowerCase() : 'Team Member';

    setUser({
      name: fullName,
      position: roleLabel,
      email: storedInfo.email,
      phone: undefined,
      department: undefined,
      address: undefined,
      dateOfBirth: undefined,
      joinedDate: undefined,
      experience: undefined,
      talentedAreas: [],
      profileImage: undefined,
    });
  }, []);

  const handleLogout = () => {
    clearAuthCookies();
    router.replace('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-xl w-full bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">Profile information unavailable</h1>
          <p className="text-gray-400 mb-6">We could not load your profile details. Please sign in again to continue.</p>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header Section with Profile Image */}
          <div className="bg-gradient-to-r from-orange-600/40 via-orange-200/30 to-orange-200/600 p-8 text-center relative backdrop-blur-sm">
            <div className="flex flex-col items-center">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white/80 shadow-xl object-cover mb-4 ring-4 ring-orange-400/30"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white/80 shadow-xl mb-4 ring-4 ring-orange-400/30 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-3xl font-semibold text-white">
                  {user.name
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n.charAt(0).toUpperCase())
                    .slice(0, 2)
                    .join('') || 'U'}
                </div>
              )}
              <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">{user.name}</h1>
              <p className="text-gray-200 text-lg font-medium drop-shadow">{user.position}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {/* Personal Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-400" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Full Name</p>
                      <p className="text-white font-medium">{user.name}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <Cake className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Date of Birth</p>
                      <p className="text-white font-medium">{user.dateOfBirth}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Email Address</p>
                      <p className="text-white font-medium break-all">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Contact Number</p>
                      <p className="text-white font-medium">{user.phone ?? 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 md:col-span-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Address</p>
                      <p className="text-white font-medium">{user.address ?? 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-400" />
                Employment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Department</p>
                      <p className="text-white font-medium">{user.department ?? 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Joined Date</p>
                      <p className="text-white font-medium">{user.joinedDate ?? 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Experience</p>
                      <p className="text-white font-medium">{user.experience ?? 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Talented Areas Section */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-400" />
                Talented Areas
              </h2>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {(user.talentedAreas && user.talentedAreas.length > 0 ? user.talentedAreas : ['No specialties listed'])?.map((area, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-orange-400/80 to-rose-500/80 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md backdrop-blur-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}