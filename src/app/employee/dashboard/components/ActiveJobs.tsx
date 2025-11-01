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
        
        // 🔹 TEMPORARY: Hardcoded data - Replace with actual API call above
        setActiveJobs([
          {
            id: 1,
            title: 'Oil Change & Inspection',
            client: 'Toyota Camry - John Doe',
            status: 'In Progress'
          }
        ]);
      } catch (error) {
        console.error('Error fetching active jobs:', error);
      }
    };

    fetchActiveJobs();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-4 relative overflow-hidden">
      {/* Subtle orange gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5 pointer-events-none" />
      
      {/* Top orange accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
      
      <div className="relative z-10">
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
                className="bg-gradient-to-br from-gray-800/50 to-transparent hover:from-gray-700/50 rounded-xl p-4 transition border border-gray-700/30 hover:border-orange-500/40 relative overflow-hidden group"
              >
                {/* Top orange accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
                
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="flex items-center justify-between relative z-10">
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
                
                {/* Bottom orange accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
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
      
      {/* Bottom orange accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
    </div>
  );
}