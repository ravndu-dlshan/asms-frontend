'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from './components/Sidebar';
import { clearAuthCookies } from '@/app/lib/cookies';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: 'Admin User',
    role: 'Administrator',
  });

  useEffect(() => {
    // Get user info from localStorage or cookies
    const storedUserInfo = localStorage.getItem('userInfo');
    let userInfo = null;
    
    if (storedUserInfo) {
      try {
        userInfo = JSON.parse(storedUserInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
    
    // If not in localStorage, try to get from cookies
    if (!userInfo && typeof window !== 'undefined') {
      const userInfoCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('userInfo='));
      if (userInfoCookie) {
        try {
          userInfo = JSON.parse(decodeURIComponent(userInfoCookie.split('=')[1]));
        } catch (error) {
          console.error('Error parsing user info from cookie:', error);
        }
      }
    }
    
    if (userInfo) {
      setUserData({
        name: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || 'Admin User',
        role: userInfo.role || 'Administrator',
      });
    }

    // Check if user is admin - check both localStorage and cookies
    let userRole = localStorage.getItem('userRole');
    
    // If not in localStorage, check cookies
    if (!userRole && typeof window !== 'undefined') {
      const roleCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('userRole='));
      if (roleCookie) {
        userRole = decodeURIComponent(roleCookie.split('=')[1]);
      }
    }
    
    // Also check userInfo.role if available
    if (!userRole && userInfo?.role) {
      userRole = userInfo.role;
    }
    
    // Check if user is admin
    if (userRole !== 'ADMIN') {
      router.push('/forbidden');
      return;
    }
    
    // Ensure localStorage is updated if we got role from cookies
    if (userRole && !localStorage.getItem('userRole')) {
      localStorage.setItem('userRole', userRole);
    }
    if (userInfo && !localStorage.getItem('userInfo')) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  }, [router]);

  const handleLogout = () => {
    // Clear all auth cookies
    clearAuthCookies();
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    
    // Navigate to home page
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Sidebar Component */}
      <AdminSidebar user={userData} onLogout={handleLogout} />

      {/* Main Content - Automatically adjusts based on sidebar state */}
      <main className="ml-20 lg:ml-64 transition-all duration-300">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

