"use client";

import React, { useEffect, useState } from "react";
import {
  getAssignedWorkOrders,
  WorkOrder,
} from "../../services/assignedWorkOrderService";

export default function ActiveJobs() {
  const [activeJobs, setActiveJobs] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<"IN_PROGRESS" | "COMPLETED">("IN_PROGRESS");
  const [typeFilter, setTypeFilter] = useState<"SERVICE" | "PROJECT" | "ALL">("ALL");
  const [filterToday, setFilterToday] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const jobs: WorkOrder[] = await getAssignedWorkOrders(
        statusFilter,
        filterToday,
        typeFilter === "ALL" ? undefined : typeFilter
      );
      setActiveJobs(jobs);
    } catch (error) {
      console.error(error);
      setActiveJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, filterToday, typeFilter]);

  const formatStatus = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "In Progress";
      case "UNASSIGNED":
        return "Unassigned";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-4 relative overflow-hidden">
      {/* Header with Filters */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-white">Active Work Orders</h2>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-sm text-gray-300 font-medium">
              Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "IN_PROGRESS" | "COMPLETED")
              }
              className="px-3 py-1.5 rounded-lg text-sm bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="typeFilter" className="text-sm text-gray-300 font-medium">
              Type:
            </label>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as "SERVICE" | "PROJECT" | "ALL")
              }
              className="px-3 py-1.5 rounded-lg text-sm bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <option value="ALL">All Types</option>
              <option value="SERVICE">Service</option>
              <option value="PROJECT">Project</option>
            </select>
          </div>

          {/* Today / All Dates Filter */}
          <div className="flex items-center gap-2">
            <input
              id="todayFilter"
              type="checkbox"
              checked={filterToday}
              onChange={(e) => setFilterToday(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="todayFilter" className="text-sm text-gray-300 font-medium">
              Today Only
            </label>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-400 text-sm text-center">Loading active jobs...</p>
        ) : activeJobs.length > 0 ? (
          activeJobs.map((job, index) => {
            const progress = Math.min(Math.max(job.progress_percentage || 0, 0), 100);
            const key = job.work_order_id ?? index;
            return (
              <div
                key={key}
                className="bg-gradient-to-br from-gray-800/50 to-transparent hover:from-gray-700/50 rounded-xl p-4 transition border border-gray-700/30 hover:border-orange-500/30 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{job.title}</h3>
                    <p className="text-gray-400 text-sm">Vehicle: {job.vehicleDetails}</p>
                    <p className="text-gray-400 text-sm mt-1">{job.description}</p>
                    {job.status_message && (
                      <p className="text-orange-300 text-xs mt-1">{job.status_message}</p>
                    )}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/15 text-orange-300">
                    {formatStatus(job.status)}
                  </span>
                </div>

                <div className="mt-3 bg-gray-700/50 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-300 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-300 text-right">{progress}%</div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-sm text-center">No active jobs found.</p>
        )}
      </div>
    </div>
  );
}