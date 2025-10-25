'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, User, Mail, Phone, MapPin, CalendarDays, Briefcase, Award, Star, Cake } from 'lucide-react';

interface UserProfile {
  name: string;
  position: string;
  email: string;
  phone: string;
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

  // 🔹 Fetch user profile from backend (uncomment and modify endpoint)
  /*
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:5173/api/user/profile');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchUserProfile();
  }, []);
  */

  // 🔹 Example placeholder data
  useEffect(() => {
    setUser({
      name: 'Alex Johnson',
      position: 'Senior Technician',
      email: 'alex.johnson@example.com',
      phone: '+94 77 123 4567',
      department: 'Maintenance',
      address: '123 Main Street, Colombo 03, Sri Lanka',
      dateOfBirth: 'January 15, 1990',
      joinedDate: 'March 12, 2022',
      experience: '8 years',
      talentedAreas: ['Equipment Repair', 'Preventive Maintenance', 'Safety Compliance', 'Team Leadership'],
      profileImage: 'https://via.placeholder.com/120',
    });
  }, []);

  const handleLogout = () => {
    console.log('User logged out');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header Section with Profile Image */}
          <div className="bg-gradient-to-r from-orange-600/40 via-orange-200/30 to-orange-200/600 p-8 text-center relative backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white/80 shadow-xl object-cover mb-4 ring-4 ring-orange-400/30"
              />
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
                      <p className="text-white font-medium">{user.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 md:col-span-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Address</p>
                      <p className="text-white font-medium">{user.address}</p>
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
                      <p className="text-white font-medium">{user.department}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Joined Date</p>
                      <p className="text-white font-medium">{user.joinedDate}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Experience</p>
                      <p className="text-white font-medium">{user.experience}</p>
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
                  {user.talentedAreas?.map((area, index) => (
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