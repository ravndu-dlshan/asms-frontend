'use client';

import { Filter, X } from 'lucide-react';

interface TaskFilterPanelProps {
  filters: {
    status: string;
    date: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export default function TaskFilterPanel({ filters, onFilterChange, onClearFilters }: TaskFilterPanelProps) {
  const hasActiveFilters = filters.status !== 'all' || filters.date !== 'all';

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Filter className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Priority filter removed per request */}

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Date</label>
          <select
            value={filters.date}
            onChange={(e) => onFilterChange('date', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this-week">This Week</option>
            <option value="next-week">Next Week</option>
          </select>
        </div>
      </div>

      {/* Quick stats removed — counts are shown in the top dashboard */}
    </div>
  );
}
