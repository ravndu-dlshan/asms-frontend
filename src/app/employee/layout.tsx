
'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  // You can fetch user data from your auth system here
  const userData = {
    name: 'John Smith',
    role: 'Technician',
    // avatar: '/path/to/avatar.jpg' // Optional
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
    // Example: 
    // signOut();
    // router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Sidebar Component */}
      <Sidebar user={userData} onLogout={handleLogout} />

      {/* Main Content - Automatically adjusts based on sidebar state */}
      <main className="ml-20 lg:ml-64 transition-all duration-300">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}