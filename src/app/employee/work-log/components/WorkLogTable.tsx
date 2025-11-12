// src/app/employee/work-log/components/WorkLogTable.tsx
'use client';

import { useState } from 'react';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimeLog {
  id: string;
  work_order_id?: string | number;
  title?: string;
  start_time?: string | null;
  end_time?: string | null;
  duration_minutes?: number | null;
  amount?: number | null; // Added field for amount
  service_description?: string | null; // Added field for service description
}

interface WorkLogTableProps {
  logs: TimeLog[];
}

export default function WorkLogTable({ logs }: WorkLogTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = logs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-xl font-bold text-white">Recent Work Log</h3>
        <p className="text-gray-400 text-sm mt-1">Track your completed services and earnings</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50 border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Job ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Service</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Start</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">End</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount (LKR)</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {paginatedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-orange-400 font-semibold">{log.work_order_id ?? log.id}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{log.title ?? '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{log.start_time ? new Date(log.start_time).toLocaleString() : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{log.end_time ? new Date(log.end_time).toLocaleString() : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{log.duration_minutes != null ? `${(log.duration_minutes / 60).toFixed(2)} h` : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{log.amount != null ? `LKR ${log.amount.toFixed(2)}` : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {logs.length > itemsPerPage && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-gray-800/30">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{startIndex + 1}</span> to{' '}
            <span className="font-medium text-white">
              {Math.min(startIndex + itemsPerPage, logs.length)}
            </span>{' '}
            of <span className="font-medium text-white">{logs.length}</span> entries
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}