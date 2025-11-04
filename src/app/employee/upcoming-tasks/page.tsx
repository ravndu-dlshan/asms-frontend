'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import TaskList from './components/TaskList';
import TaskFilterPanel from './components/TaskFilterPanel';
import TaskDetailPanel from './components/TaskDetailPanel';
import type { Task } from './types';
import axiosInstance from '@/app/lib/axios';

interface WorkOrderDTO {
  id: number;
  appointmentId?: number | null;
  vehicleId?: number | null;
  vehicleDetails?: string | null;
  customerId?: number | null;
  customerName?: string | null;
  type?: string | null;
  title?: string | null;
  description?: string | null;
  assignedEmployeeId?: number | null;
  assignedEmployeeName?: string | null;
  status?: string | null;
  progressPercentage?: number | null;
  statusMessage?: string | null;
  estimatedCost?: number | null;
  actualCost?: number | null;
  estimatedCompletion?: string | null;
  actualCompletion?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export default function UpcomingTasksPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    date: 'all'
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const controller = new AbortController();

    const mapStatus = (s?: string | null) => {
      if (!s) return 'scheduled';
      const key = String(s).toUpperCase();
      if (key === 'UNASSIGNED') return 'scheduled';
      if (key === 'ASSIGNED') return 'in-progress';
      if (key === 'COMPLETED' || key === 'DONE') return 'completed';
      return String(s).toLowerCase();
    };

    async function fetchWorkOrders(signal?: AbortSignal) {
      setLoading(true);
      setError(null);
      try {
        // Use axiosInstance so the request gets the Authorization header from cookie (if present)
        const res = await axiosInstance.get<ApiResponse<WorkOrderDTO[]>>('/api/work-orders/available', { signal });
        const json = res.data;
        if (json?.success && Array.isArray(json.data)) {
          const mapped: Task[] = json.data.map((w) => ({
            id: String(w.id),
            title: w.title ?? w.type ?? 'Work Order',
            vehicleModel: w.vehicleDetails ?? '',
            customerName: w.customerName ?? '',
            location: '',
            scheduledTime: w.estimatedCompletion ?? w.createdAt ?? new Date().toISOString(),
            estimatedDuration: '',
            priority: '',
            status: mapStatus(w.status ?? undefined),
            description: w.description ?? w.statusMessage ?? '',
            customerPhone: '',
            customerEmail: '',
            requiredParts: [],
            specialInstructions: '',
            estimatedCost: w.estimatedCost ?? null,
            statusMessage: w.statusMessage ?? null,
            assignedEmployeeName: w.assignedEmployeeName ?? null,
            appointmentId: w.appointmentId ?? null,
            vehicleId: w.vehicleId ?? null,
            createdAt: w.createdAt ?? null,
            updatedAt: w.updatedAt ?? null
          }));
          setTasks(mapped);
        } else {
          setError(json?.message ?? 'Unexpected response from server');
        }
      } catch (err) {
        // err may be Error or other; stringify safely
        // axios errors may contain response.status
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e: any = err;
        if (e?.name === 'AbortError') {
          // ignore
        } else if (e?.response?.status === 403) {
          setError('Forbidden: you may need to sign in (403)');
        } else {
          setError(String(e?.message ?? e));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchWorkOrders(controller.signal);

    return () => controller.abort();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      date: 'all'
    });
  };

  const stats = [
    {
      label: 'Today\'s Tasks',
      value: tasks.filter(t => new Date(t.scheduledTime).toDateString() === new Date().toDateString()).length,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400'
    },
    {
      label: 'In Progress',
      value: tasks.filter(t => t.status === 'in-progress').length,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-400'
    },
    {
      label: 'Urgent',
      value: tasks.filter(t => t.priority === 'urgent').length,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      iconColor: 'text-red-400'
    },
    {
      label: 'Completed Today',
      value: 3,
      icon: CheckCircle2,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-400'
    }
  ];

  return (
    <div className="space-y-6">
      {loading && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
          <p className="text-gray-400">Loading tasks...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-900 rounded-xl p-4 border border-red-800 text-center">
          <p className="text-red-200">Error loading tasks: {error}</p>
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Upcoming Tasks</h1>
        <p className="text-gray-400">Manage and track your scheduled service appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <TaskFilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="lg:col-span-4">
          <TaskList
            tasks={tasks}
            onTaskSelect={(task: Task) => setSelectedTask(task)}
            selectedTask={selectedTask}
            filters={filters}
          />
        </div>

        <div className="lg:col-span-5">
          <TaskDetailPanel task={selectedTask} />
        </div>
      </div>
    </div>
  );
}
