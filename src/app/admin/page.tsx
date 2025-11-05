"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Dashboard from './dashboard/page';

export default function Admin() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        let userRole: string | null = null;

        // Check localStorage first
        if (typeof window !== 'undefined') {
          userRole = localStorage.getItem('userRole');
          
          // If not in localStorage, check cookies
          if (!userRole) {
            const roleCookie = document.cookie
              .split('; ')
              .find(row => row.startsWith('userRole='));
            if (roleCookie) {
              userRole = decodeURIComponent(roleCookie.split('=')[1]);
            }
          }
          
          // Check userInfo.role if available
          if (!userRole) {
            const storedUserInfo = localStorage.getItem('userInfo');
            if (storedUserInfo) {
              try {
                const userInfo = JSON.parse(storedUserInfo);
                userRole = userInfo?.role || null;
              } catch (error) {
                console.error('Error parsing user info:', error);
              }
            }
          }
          
          // Update localStorage if we got role from cookies
          if (userRole && !localStorage.getItem('userRole')) {
            localStorage.setItem('userRole', userRole);
          }
        }
        
        // Check if user is admin
        if (userRole !== 'ADMIN') {
          router.push('/forbidden');
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/forbidden');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div>
      <Dashboard />
    </div>
  );
}