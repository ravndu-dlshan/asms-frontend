'use client';

import Link from 'next/link';

export default function QuickActions() {
  const actions = [
    { label: 'Request Parts', href: '/employee/parts-request' },
    { label: 'Log Time', href: '/employee/work-log' },
    { label: 'View Tasks', href: '/employee/upcoming-tasks' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5 pointer-events-none" />

      <div className="relative">
        <h2 className="text-xl font-bold text-white mb-3 lg:px-8 md:px-4 px-2">Quick Actions</h2>

        <div className="grid grid-cols-1 gap-3 lg:px-8 md:px-4 px-2 lg:py-3">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="w-full relative flex items-center justify-center p-4 lg:mb-1 bg-gradient-to-br from-gray-800/50 to-transparent
                         border border-gray-700/30 hover:border-orange-500/40 rounded-xl transition-all text-gray-300 hover:text-white
                         group overflow-hidden"
            >
              {/* Accent Lines */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <span className="text-sm font-medium relative z-10 text-center">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}