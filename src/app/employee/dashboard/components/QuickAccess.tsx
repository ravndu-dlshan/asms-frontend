'use client';

import Link from 'next/link';

export default function QuickActions() {
  const actions = [
    { label: 'Request Parts', href: '/employee/parts-request' },
    { label: 'Log Time', href: '/employee/work-log' },
    { label: 'View Upcoming Tasks', href: '/employee/upcoming-tasks' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
      <div className="flex gap-6">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex-1 flex flex-col items-center justify-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transition text-gray-300 hover:text-white"
          >
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
