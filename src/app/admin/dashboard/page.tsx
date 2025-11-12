'use client';

import { useState, useEffect } from 'react';
import StatCard from './components/StatCard';
import GreetingSection from './components/GreetingSection';
import CreateEmployeeForm from './components/CreateEmployeeForm';
import { Briefcase, CheckCircle, Clock } from 'lucide-react';
import axiosInstance from '@/app/lib/axios';

interface DashboardStats {
  activeWorkOrders: number;
  completedToday: number;
  pendingAppointments: number;
}

export default function AdminDashboard() {
  const [userName, setUserName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    activeWorkOrders: 0,
    completedToday: 0,
    pendingAppointments: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);

    try {
      // Only fetch work orders and appointments from admin endpoints
      const [workOrdersRes, appointmentsRes] = await Promise.allSettled([
        axiosInstance.get('/api/work-orders/available'),
        axiosInstance.get('/api/customer/appointments'),
      ]);

      // Process work orders with better debugging
      let activeWorkOrders = 0;
      let completedToday = 0;
      
      if (workOrdersRes.status === 'fulfilled' && workOrdersRes.value?.data) {
        const workOrdersData = workOrdersRes.value.data;
        console.log('Work Orders Response:', workOrdersData); // Debug log
        
        // Handle different response structures
        let workOrdersArr: any[] = [];
        
        if (Array.isArray(workOrdersData)) {
          workOrdersArr = workOrdersData;
        } else if (workOrdersData.data && Array.isArray(workOrdersData.data)) {
          workOrdersArr = workOrdersData.data;
        } else if (workOrdersData.success && Array.isArray(workOrdersData.data)) {
          workOrdersArr = workOrdersData.data;
        } else if (workOrdersData.content && Array.isArray(workOrdersData.content)) {
          workOrdersArr = workOrdersData.content;
        }
        
        console.log('Parsed Work Orders:', workOrdersArr.length); // Debug log
        setWorkOrders(workOrdersArr);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        workOrdersArr.forEach((wo: any) => {
          // Get status - handle different case formats
          const status = (wo.status?.toUpperCase() || wo.status || '').trim();
          
          // Count completed today first
          const isCompleted = 
            status === 'COMPLETED' || 
            status === 'DONE' || 
            status === 'FINISHED' ||
            status === 'CLOSED';
          
          if (isCompleted) {
            const completedDate = wo.completedAt || wo.completedDate || wo.updatedAt || wo.createdAt;
            if (completedDate) {
              const compDate = new Date(completedDate);
              compDate.setHours(0, 0, 0, 0);
              if (compDate.getTime() === today.getTime()) {
                completedToday++;
              }
            }
          }
          
          // Count active work orders (anything that's not completed)
          // Include: IN_PROGRESS, ASSIGNED, PENDING, ACTIVE, OPEN, NEW, null/empty
          if (!isCompleted) {
            activeWorkOrders++;
          }
        });
        
        console.log(`Stats: Active=${activeWorkOrders}, Completed Today=${completedToday}, Total=${workOrdersArr.length}`);
      } else if (workOrdersRes.status === 'rejected') {
        console.error('Work Orders API Error:', workOrdersRes.reason);
        // If work orders failed, show error but don't block other stats
        setError('Could not fetch work orders. Please check API endpoint.');
      }

      // Process appointments
      let pendingAppointments = 0;
      if (appointmentsRes.status === 'fulfilled' && appointmentsRes.value?.data) {
        const appointmentsData = appointmentsRes.value.data;
        const appointmentsArr = Array.isArray(appointmentsData)
          ? appointmentsData
          : (appointmentsData.data && Array.isArray(appointmentsData.data) ? appointmentsData.data : []);
        
        appointmentsArr.forEach((apt: any) => {
          const status = apt.status?.toUpperCase() || '';
          if (status === 'PENDING' || status === 'CONFIRMED' || !status) {
            pendingAppointments++;
          }
        });
        setAppointments(appointmentsArr);
      }

      setStats({
        activeWorkOrders,
        completedToday,
        pendingAppointments,
      });
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load some statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get user info from localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const userInfo = JSON.parse(storedUserInfo);
        setUserName(`${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || 'Admin');
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
    
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const handleEmployeeCreated = () => {
    // Refresh stats after creating employee
    fetchDashboardStats();
  };

  const statsArray = [
    {
      title: "Active Work Orders",
      value: stats.activeWorkOrders,
      change: "+0%",
      icon: Briefcase,
      color: "from-orange-500 to-orange-600",
      subtitle: "In progress",
    },
    {
      title: "Completed Today",
      value: stats.completedToday,
      change: "+0%",
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      subtitle: "Finished tasks",
    },
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments,
      change: "+0%",
      icon: Clock,
      color: "from-purple-500 to-purple-600",
      subtitle: "Upcoming",
    },
  ];

  return (
    <main className="min-h-screen">
      <div className="max-w-screen-2xl mx-auto space-y-6">
        {/* Greeting Section */}
        <GreetingSection userName={userName} />

        {/* Stats Cards */}
        {error && (
          <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
            {error} - Some statistics may not be available.
          </div>
        )}
        <StatCard loading={loading} stats={statsArray} />

        {/* Create Employee Form - full width */}
        <div className="grid grid-cols-1 gap-6">
          <CreateEmployeeForm onSuccess={handleEmployeeCreated} />
        </div>
        {/* Records */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Records</h2>
            <p className="text-sm text-gray-400">Latest appointments and work orders</p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* All Appointments */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">All Appointments</h3>
                <span className="text-sm text-gray-400">{appointments.length} items</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-gray-300">
                  <thead className="text-gray-400 border-b border-gray-700">
                    <tr>
                      <th className="py-2 pr-4">ID</th>
                      <th className="py-2 pr-4">Customer</th>
                      <th className="py-2 pr-4">Service</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Time</th>
                      <th className="py-2 pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a: any, idx: number) => (
                      <tr key={a?.id ?? idx} className="border-b border-gray-800 hover:bg-gray-800/40">
                        <td className="py-2 pr-4">{a?.id ?? '-'}</td>
                        <td className="py-2 pr-4">
                          {(a?.customer?.name) || `${a?.firstName ?? ''} ${a?.lastName ?? ''}`.trim() || '-'}
                        </td>
                        <td className="py-2 pr-4">{a?.serviceType ?? a?.type ?? '-'}</td>
                        <td className="py-2 pr-4">{a?.appointmentDate ?? a?.date ?? '-'}</td>
                        <td className="py-2 pr-4">{a?.appointmentTime ?? a?.time ?? '-'}</td>
                        <td className="py-2 pr-4">
                          <span className="px-2 py-1 text-xs rounded border border-gray-600">
                            {(a?.status ?? 'PENDING').toString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td className="py-4 pr-4 text-gray-500" colSpan={6}>No appointments found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* All Work Orders */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">All Work Orders</h3>
                <span className="text-sm text-gray-400">{workOrders.length} items</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-gray-300">
                  <thead className="text-gray-400 border-b border-gray-700">
                    <tr>
                      <th className="py-2 pr-4">ID</th>
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Customer</th>
                      <th className="py-2 pr-4">Created</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Assignee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workOrders.map((wo: any, idx: number) => (
                      <tr key={wo?.id ?? wo?.work_order_id ?? idx} className="border-b border-gray-800 hover:bg-gray-800/40">
                        <td className="py-2 pr-4">{wo?.id ?? wo?.work_order_id ?? '-'}</td>
                        <td className="py-2 pr-4">{wo?.title ?? wo?.description ?? '-'}</td>
                        <td className="py-2 pr-4">
                          {(wo?.customer?.name) || `${wo?.customerFirstName ?? ''} ${wo?.customerLastName ?? ''}`.trim() || '-'}
                        </td>
                        <td className="py-2 pr-4">{wo?.createdAt ?? wo?.created_at ?? '-'}</td>
                        <td className="py-2 pr-4">
                          <span className="px-2 py-1 text-xs rounded border border-gray-600">
                            {(wo?.status ?? 'PENDING').toString()}
                          </span>
                        </td>
                        <td className="py-2 pr-4">
                          {(wo?.assignee?.name) || `${wo?.assigneeFirstName ?? ''} ${wo?.assigneeLastName ?? ''}`.trim() || '-'}
                        </td>
                      </tr>
                    ))}
                    {workOrders.length === 0 && (
                      <tr>
                        <td className="py-4 pr-4 text-gray-500" colSpan={6}>No work orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

