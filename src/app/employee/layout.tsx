
'use client';

import Sidebar from './components/Sidebar';

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content - Automatically adjusts based on sidebar state */}
      <main className="ml-20 lg:ml-64 transition-all duration-300">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}