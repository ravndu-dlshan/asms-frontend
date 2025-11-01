// src/app/employee/part-requests/components/PartRequestList.tsx
'use client';

import { useState } from 'react';
import { Search, Download, Eye, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import PartStatusBadge from './PartStatusBadge';
import { formatDate } from '../../utils';

interface PartRequest {
  id: string;
  partName: string;
  vehicleModel: string;
  quantity: number;
  requestDate: string;
  status: string;
}

interface PartRequestListProps {
  requests: PartRequest[];
}

export default function PartRequestList({ requests }: PartRequestListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by part name, code, or vehicle model..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="delivered">Delivered</option>
            <option value="rejected">Rejected</option>
          </select>

          <button className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Part Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Vehicle Model
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Request Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((request, index) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-orange-400 font-semibold">{request.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                      {request.partName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {request.vehicleModel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {request.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {formatDate(request.requestDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PartStatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-orange-400 hover:text-orange-300 transition-colors p-2 hover:bg-gray-800 rounded-lg">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Filter className="w-12 h-12 text-gray-600 mb-3" />
                      <p className="text-gray-400 text-lg font-medium">No requests found</p>
                      <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search term</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredRequests.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-gray-800/30">
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium text-white">{startIndex + 1}</span> to{' '}
              <span className="font-medium text-white">
                {Math.min(startIndex + itemsPerPage, filteredRequests.length)}
              </span>{' '}
              of <span className="font-medium text-white">{filteredRequests.length}</span> results
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
    </div>
  );
}