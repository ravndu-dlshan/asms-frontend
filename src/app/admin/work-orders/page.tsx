'use client';

import { useState } from 'react';
import { Briefcase, Filter } from 'lucide-react';

export default function WorkOrdersPage() {
  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Work Orders Management</h1>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="text-center py-12 text-gray-400">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">Work Orders Management</p>
          <p className="text-sm">Work orders list and management functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  );
}

