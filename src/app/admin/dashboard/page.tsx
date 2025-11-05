'use client';

import { useState, useEffect } from 'react';
import StatCard from './components/StatCard';
import GreetingSection from './components/GreetingSection';
import CreateEmployeeForm from './components/CreateEmployeeForm';
import { Users, Briefcase, CheckCircle, Clock } from 'lucide-react';
import axiosInstance from '@/app/lib/axios';

interface DashboardStats {
  totalEmployees: number;
  activeWorkOrders: number;
  completedToday: number;
  pendingAppointments: number;
}

export default function AdminDashboard() {
  const [userName, setUserName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeWorkOrders: 0,
    completedToday: 0,
    pendingAppointments: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    
    // Verify token exists before making requests
    const token = localStorage.getItem('authToken') || (typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1] : null);
    console.log('🔍 Checking auth token before API calls:', {
      hasLocalStorageToken: !!localStorage.getItem('authToken'),
      hasCookieToken: !!(typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1] : null),
      userRole: localStorage.getItem('userRole'),
    });
    
    try {
      // Fetch all stats in parallel - but let's try one at a time with better error handling
      const [employeesRes, workOrdersRes, appointmentsRes] = await Promise.allSettled([
        // Try to fetch employees - common endpoints
        axiosInstance.get('/api/admin/employees').catch((err) => {
          console.error('❌ Failed /api/admin/employees:', err.response?.status, err.response?.data);
          return axiosInstance.get('/api/employees').catch((err2) => {
            console.error('❌ Failed /api/employees:', err2.response?.status, err2.response?.data);
            return null;
          });
        }),
        // Try to fetch work orders - try admin endpoint first, then general
        axiosInstance.get('/api/admin/work-orders').catch((err) => {
          console.error('❌ Failed /api/admin/work-orders:', err.response?.status, err.response?.data);
          return axiosInstance.get('/api/work-orders').catch((err2) => {
            console.error('❌ Failed /api/work-orders:', err2.response?.status, err2.response?.data);
            return axiosInstance.get('/api/admin/work-orders/all').catch((err3) => {
              console.error('❌ Failed /api/admin/work-orders/all:', err3.response?.status, err3.response?.data);
              return null;
            });
          });
        }),
        // Try to fetch appointments
        axiosInstance.get('/api/admin/appointments').catch((err) => {
          console.error('❌ Failed /api/admin/appointments:', err.response?.status, err.response?.data);
          return axiosInstance.get('/api/appointments').catch((err2) => {
            console.error('❌ Failed /api/appointments:', err2.response?.status, err2.response?.data);
            return null;
          });
        }),
      ]);

      // Process employees count
      let totalEmployees = 0;
      if (employeesRes.status === 'fulfilled' && employeesRes.value?.data) {
        const employeesData = employeesRes.value.data;
        if (Array.isArray(employeesData)) {
          totalEmployees = employeesData.length;
        } else if (employeesData.data && Array.isArray(employeesData.data)) {
          totalEmployees = employeesData.data.length;
        } else if (typeof employeesData.count === 'number') {
          totalEmployees = employeesData.count;
        } else if (typeof employeesData.total === 'number') {
          totalEmployees = employeesData.total;
        }
      }

      // Process work orders with better debugging
      let activeWorkOrders = 0;
      let completedToday = 0;
      
      if (workOrdersRes.status === 'fulfilled' && workOrdersRes.value?.data) {
        const workOrdersData = workOrdersRes.value.data;
        console.log('Work Orders Response:', workOrdersData); // Debug log
        
        // Handle different response structures
        let workOrders: any[] = [];
        
        if (Array.isArray(workOrdersData)) {
          workOrders = workOrdersData;
        } else if (workOrdersData.data && Array.isArray(workOrdersData.data)) {
          workOrders = workOrdersData.data;
        } else if (workOrdersData.success && Array.isArray(workOrdersData.data)) {
          workOrders = workOrdersData.data;
        } else if (workOrdersData.content && Array.isArray(workOrdersData.content)) {
          workOrders = workOrdersData.content;
        }
        
        console.log('Parsed Work Orders:', workOrders.length); // Debug log
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        workOrders.forEach((wo: any) => {
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
        
        console.log(`Stats: Active=${activeWorkOrders}, Completed Today=${completedToday}, Total=${workOrders.length}`);
      } else if (workOrdersRes.status === 'rejected') {
        console.error('Work Orders API Error:', workOrdersRes.reason);
        // If work orders failed, show error but don't block other stats
        setError('Could not fetch work orders. Please check API endpoint.');
      }

      // Process appointments
      let pendingAppointments = 0;
      if (appointmentsRes.status === 'fulfilled' && appointmentsRes.value?.data) {
        const appointmentsData = appointmentsRes.value.data;
        const appointments = Array.isArray(appointmentsData)
          ? appointmentsData
          : (appointmentsData.data && Array.isArray(appointmentsData.data) ? appointmentsData.data : []);
        
        appointments.forEach((apt: any) => {
          const status = apt.status?.toUpperCase() || '';
          if (status === 'PENDING' || status === 'CONFIRMED' || !status) {
            pendingAppointments++;
          }
        });
      }

      setStats({
        totalEmployees,
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
      title: "Total Employees",
      value: stats.totalEmployees,
      change: "+0%",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      subtitle: "Active staff",
    },
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Greeting Section */}
        <GreetingSection userName={userName} />

        {/* Stats Cards */}
        {error && (
          <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
            {error} - Some statistics may not be available.
          </div>
        )}
        <StatCard loading={loading} stats={statsArray} />

        {/* Create Employee Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1">
            <CreateEmployeeForm onSuccess={handleEmployeeCreated} />
          </div>

          {/* Quick Actions or Additional Info */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
                  <p className="text-white font-medium">View All Employees</p>
                  <p className="text-gray-400 text-sm">Manage employee accounts</p>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
                  <p className="text-white font-medium">Manage Work Orders</p>
                  <p className="text-gray-400 text-sm">View and assign work orders</p>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
                  <p className="text-white font-medium">System Settings</p>
                  <p className="text-gray-400 text-sm">Configure system preferences</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

