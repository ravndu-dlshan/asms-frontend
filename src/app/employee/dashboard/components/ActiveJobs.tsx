"use client";

import React, { useEffect, useState } from "react";
import {
  getAssignedWorkOrders,
  WorkOrder,
} from "../../services/assignedWorkOrderService";

export default function ActiveJobs() {
  const [activeJobs, setActiveJobs] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveJobs = async () => {
      setLoading(true);
      try {
        const jobs: WorkOrder[] = await getAssignedWorkOrders(
          "IN_PROGRESS",
          true
        );
        setActiveJobs(jobs);
      } catch (error) {
        console.error(error);
        setActiveJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveJobs();
  }, []);

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
      {/* Decorative gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            Active Work Orders
          </h2>
          <button className="text-orange-500 hover:text-orange-400 text-sm font-medium transition cursor-pointer">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-400 text-sm text-center">
              Loading active jobs...
            </p>
          ) : activeJobs.length > 0 ? (
            activeJobs.map((job, index) => {
              const progress = Math.min(
                Math.max(job.progress_percentage || 0, 0),
                100
              );
              const key = job.work_order_id ?? index;

              return (
                <div
                  key={key}
                  className="bg-gradient-to-br from-gray-800/50 to-transparent hover:from-gray-700/50 rounded-xl p-4 transition border border-gray-700/30 hover:border-orange-500/40 relative overflow-hidden group"
                >
                  {/* Decorative gradients */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Job info */}
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h3 className="text-white font-semibold">{job.title}</h3>
                      <p className="text-gray-400 text-sm">
                        Vehicle: {job.vehicleDetails}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {job.description}
                      </p>
                      {job.status_message && (
                        <p className="text-orange-400 text-xs mt-1">
                          {job.status_message}
                        </p>
                      )}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">
                      {formatStatus(job.status)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 bg-gray-700/30 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-orange-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-300 text-right">
                    {progress}%
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-sm text-center">
              No active jobs found.
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
    </div>
  );
}
