'use client';

import React, { useEffect, useState } from 'react';

interface Job {
  id: number;
  title: string;
  client: string;
  status: string;
}

export default function ActiveJobs() {
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);

  useEffect(() => {
    // 🔹 Fetch active jobs from your backend API
    // Example: Replace the URL below with your actual endpoint
    // (e.g., http://localhost:5173/api/active-jobs or your deployed endpoint)
    const fetchActiveJobs = async () => {
      try {
        //const response = await fetch('http://localhost:5173/api/active-jobs');
        //if (!response.ok) throw new Error('Failed to fetch active jobs');
        //const data = await response.json();
        //setActiveJobs(data);
      } catch (error) {
        console.error('Error fetching active jobs:', error);
      }
    };

    fetchActiveJobs();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Active Jobs</h2>
        {/* 🔹 Optional: Link this to a full job list page */}
        <button className="text-orange-500 hover:text-orange-400 text-sm font-medium transition cursor-pointer">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activeJobs.length > 0 ? (
          activeJobs.map((job) => (
            <div
              key={job.id}
              className="bg-gray-700 hover:bg-gray-650 rounded-xl p-4 transition border border-gray-600 hover:border-gray-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">{job.title}</h3>
                  <p className="text-gray-400 text-sm">{job.client}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === 'In Progress'
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-gray-600/50 text-gray-400'
                  }`}
                >
                  {job.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          // 🔹 Display this if no jobs are available or loading
          <p className="text-gray-400 text-sm text-center">
            No active jobs found.
          </p>
        )}
      </div>
    </div>
  );
}
