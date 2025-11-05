"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Dashboard from './dashboard/page';

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
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
    if (!userRole) {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        try {
          const userInfo = JSON.parse(storedUserInfo);
          userRole = userInfo.role;
        } catch (error) {
          console.error('Error parsing user info:', error);
        }
      }
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
  }, [router]);

  return (
    <div>
      <Dashboard />
    </div>
  );
}
