'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, User, Mail, Phone, MapPin, CalendarDays, Briefcase } from 'lucide-react';

interface UserProfile {
  name: string;
  role: string;
  email: string;
  phone: string;
  department?: string;
  location?: string;
  joinedDate?: string;
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
      role: 'Senior Technician',
      email: 'alex.johnson@example.com',
      phone: '+94 77 123 4567',
      department: 'Maintenance',
      location: 'Colombo, Sri Lanka',
      joinedDate: 'March 12, 2022',
      profileImage: 'https://via.placeholder.com/80',
    });
  }, []);

  const handleLogout = () => {
    console.log('User logged out');
  };

  if (!user) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 text-white relative transition">
      <div className="flex items-center gap-6">
        <img
          src={user.profileImage}
          alt={user.name}
          className="w-20 h-20 rounded-full border-2 border-orange-400 object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-400">{user.role}</p>
        </div>
      </div>

      {/* 🔹 User details */}
      <div className="mt-5 space-y-3 text-gray-300">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-orange-400" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-orange-400" />
          <span>{user.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-orange-400" />
          <span>{user.department}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-orange-400" />
          <span>{user.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="w-5 h-5 text-orange-400" />
          <span>Joined {user.joinedDate}</span>
        </div>
      </div>

      {/* 🔹 Logout Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 cursor-pointer text-white px-4 py-2 rounded-xl transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
