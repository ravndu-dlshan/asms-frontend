'use client';

import { useState, useEffect } from 'react';
import StatCard from './components/StatCard';
import QuickActions from './components/QuickAccess';
import ActiveJobs from './components/ActiveJobs';
import RecentAppointments from './components/RecentAppointments';
import GreetingSection from './components/GreetingSection';

interface Job {
  id: string;
  title: string;
  status: string;
}

interface Appointment {
  id: string;
  client: string;
  date: string;
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        setJobs([{ id: '0', title: '', status: '' }]);
        setAppointments([{ id: '0', client: '', date: '' }]);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-400 text-center">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen sm:p-4 md:p-3 lg:p-3">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Greeting Section */}
        <GreetingSection userName="John" />
        {/* Jobs and Appointments */}
        <div className="w-full lg:col-span-2">
          <ActiveJobs />
        </div>
      </div>
    </main>
  );
}