'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
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
  const [startedTasks, setStartedTasks] = useState<Set<string>>(new Set());
  // locally completed during this session — kept until page refresh / logout
  const [locallyCompleted, setLocallyCompleted] = useState<Set<string>>(new Set());
  // lifted search term so counts update when user searches
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    date: 'all'
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // central status mapper so all places use the same logic
  const mapStatus = (s?: string | null) => {
    if (!s) return 'scheduled';
    const key = String(s).toUpperCase();
    if (key === 'UNASSIGNED') return 'scheduled';
    // treat ASSIGNED as scheduled per new requirement
    if (key === 'ASSIGNED' || key === 'SCHEDULED') return 'scheduled';
    if (key === 'IN_PROGRESS') return 'in-progress';
    if (key === 'COMPLETED' || key === 'DONE') return 'completed';
    return String(s).toLowerCase();
  };
  // Fetch work orders for the logged-in employee (exposed so child can call onRefresh)
  const fetchWorkOrders = useCallback(async (signal?: AbortSignal): Promise<Task[] | undefined> => {
    setLoading(true);
    setError(null);
    try {
      // fetch assigned and available in parallel then merge uniquely by id
      const [assignedRes, availableRes] = await Promise.all([
        axiosInstance.get<ApiResponse<WorkOrderDTO[]>>('/api/work-orders/my-assigned', { signal }),
        axiosInstance.get<ApiResponse<WorkOrderDTO[]>>('/api/work-orders/available', { signal })
      ]);

      const assigned = assignedRes?.data?.success && Array.isArray(assignedRes.data.data) ? assignedRes.data.data : [];
      const available = availableRes?.data?.success && Array.isArray(availableRes.data.data) ? availableRes.data.data : [];

      const byId = new Map<number, WorkOrderDTO>();
      // prefer assigned data when duplicate
      [...available, ...assigned].forEach((w) => {
        if (!w || typeof w.id === 'undefined' || w.id === null) return;
        const existing = byId.get(w.id);
        if (!existing) byId.set(w.id, w);
        else {
          // merge fields, prefer assigned (if current item from assigned override)
          byId.set(w.id, { ...existing, ...w });
        }
      });

      const merged = Array.from(byId.values());

      const mapped: Task[] = merged.map((w) => ({
        id: String(w.id),
        title: w.title ?? w.type ?? 'Work Order',
        vehicleModel: w.vehicleDetails ?? '',
        customerName: w.customerName ?? '',
        location: '',
        scheduledTime: w.estimatedCompletion ?? w.createdAt ?? new Date().toISOString(),
        estimatedDuration: '',
        priority: '',
        status: mapStatus(w.status ?? undefined) || 'scheduled',
        description: w.description ?? w.statusMessage ?? '',
        customerPhone: '',
        customerEmail: '',
        requiredParts: [],
        specialInstructions: '',
        estimatedCost: w.estimatedCost ?? null,
        statusMessage: w.statusMessage ?? null,
        assignedEmployeeName: w.assignedEmployeeName ?? null,
        assignedEmployeeId: w.assignedEmployeeId ?? null,
        appointmentId: w.appointmentId ?? null,
        vehicleId: w.vehicleId ?? null,
        createdAt: w.createdAt ?? null,
        updatedAt: w.updatedAt ?? null
      }));

      // ensure any locally completed tasks remain visible until refresh/logout
      const withLocalCompleted = mapped.map((t) => (locallyCompleted.has(t.id) ? { ...t, status: 'completed' } : t));

  setTasks(withLocalCompleted);
  return withLocalCompleted;
    } catch (err) {
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
  }, [locallyCompleted]);

  useEffect(() => {
    const controller = new AbortController();
    fetchWorkOrders(controller.signal).finally(() => setLoading(false));
    return () => controller.abort();
  }, [fetchWorkOrders]);

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

  // prepare visible tasks by applying local overrides (started / locally completed)
  const applyLocalOverrides = (list: Task[]) => list.map(t => {
    if (locallyCompleted.has(t.id)) return { ...t, status: 'completed' };
    if (startedTasks.has(t.id)) return { ...t, status: 'in-progress' };
    return t;
  });

  // filtering (status, date, search) — TaskList previously kept its own search; lift it here so counts update with search
  const matchesStatusFilter = (task: Task, statusFilter: string) => {
    if (statusFilter === 'all') return true;
    return task.status === statusFilter;
  };

  const matchesDateFilter = (task: Task, dateFilter: string) => {
    if (dateFilter === 'all') return true;
    const taskDate = new Date(task.scheduledTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (dateFilter) {
      case 'today':
        return taskDate.toDateString() === today.toDateString();
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return taskDate.toDateString() === tomorrow.toDateString();
      case 'this-week':
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return taskDate >= today && taskDate <= weekEnd;
      default:
        return true;
    }
  };

  const matchesSearch = (task: Task, term: string) => {
    if (!term) return true;
    const q = term.toLowerCase();
    return task.title.toLowerCase().includes(q) || task.vehicleModel.toLowerCase().includes(q) || task.customerName.toLowerCase().includes(q);
  };

  const effectiveTasks = applyLocalOverrides(tasks);
  const filteredTasks = effectiveTasks.filter(t => matchesStatusFilter(t, filters.status) && matchesDateFilter(t, filters.date) && matchesSearch(t, searchTerm));

  // derive quick stats from the currently displayed (filtered) tasks so UI stays up-to-date
  const stats = [
    {
      label: 'Today\'s Tasks',
      // total of all tasks currently displayed (regardless of status)
      value: filteredTasks.length,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400'
    },
    {
      label: 'In Progress',
      // count tasks with status "IN_PROGRESS" (mapped to 'in-progress')
      value: filteredTasks.filter(t => t.status === 'in-progress').length,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-400'
    },
    {
      label: 'Scheduled',
      // count tasks with server statuses ASSIGNED or SCHEDULED (mapped to 'scheduled')
      value: filteredTasks.filter(t => t.status === 'scheduled').length,
      icon: AlertTriangle,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400'
    }
  ];

  // Start task handler: optimistic update and call backend to update status via PUT
  const handleStartTask = async (task: Task) => {
    const prevTasks = tasks;
    const prevSelected = selectedTask;

    // optimistic update (frontend representation)
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'in-progress' } : t));
    if (selectedTask?.id === task.id) setSelectedTask({ ...task, status: 'in-progress' });

    try {
      // Backend expects PUT /api/work-orders/{id}/status with { status: 'IN_PROGRESS' }
  const bodyStart: Record<string, unknown> = { status: 'IN_PROGRESS', appointmentId: task.appointmentId ?? null };
      console.log('PUT', `/api/work-orders/${task.id}/status`, bodyStart);
      await axiosInstance.put(`/api/work-orders/${task.id}/status`, bodyStart, { headers: { 'Content-Type': 'application/json' } });

  // optimistic local mark and remember this task as started locally so UI won't revert while we refresh
  setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'in-progress' } : t));
  setStartedTasks(prev => new Set(prev).add(String(task.id)));

      // refresh full list to reconcile statuses for all tasks
      try {
        const freshList = await fetchWorkOrders();
        if (freshList) {
          const fresh = freshList.find(m => m.id === String(task.id));
          if (fresh) setSelectedTask(fresh);
        }
      } catch (e) {
        console.error('Failed to refresh tasks after start', e);
      }
  } catch (err) {
      // revert optimistic update on error and show a helpful message
      setTasks(prevTasks);
      setSelectedTask(prevSelected);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((err as any)?.response?.status === 400) setError('Bad request when starting task (400)');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else if ((err as any)?.response?.status === 404) setError('Work order not found (404)');
      else setError('Failed to start task — please try again');
    }
  };

  // Complete task handler: update status via PUT and refresh list
  const handleCompleteTask = async (task: Task) => {
    const prevTasks = tasks;
    const prevSelected = selectedTask;
    try {
      // optimistic UI: set to completed locally
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
      if (selectedTask?.id === task.id) setSelectedTask({ ...task, status: 'completed' });

      // Backend expects PUT /api/work-orders/{id}/status with { status: 'COMPLETED' }
      const bodyComplete = { status: 'COMPLETED', appointmentId: task.appointmentId ?? null };
      console.log('PUT', `/api/work-orders/${task.id}/status`, bodyComplete);
      await axiosInstance.put(`/api/work-orders/${task.id}/status`, bodyComplete, { headers: { 'Content-Type': 'application/json' } });

      // refresh full list
      try {
        const freshList = await fetchWorkOrders();
        if (freshList) {
          const fresh = freshList.find(m => m.id === String(task.id));
          if (fresh) setSelectedTask(fresh);
        }
      } catch (e) {
        console.error('Failed to refresh tasks after complete', e);
      }

      // remove from local started override (it's completed now)
      setStartedTasks(prev => {
        const s = new Set(prev);
        s.delete(task.id);
        return s;
      });
      // remember completed locally so it remains visible until refresh/logout
      setLocallyCompleted(prev => new Set(prev).add(String(task.id)));
  } catch (err) {
      // revert on error
      setTasks(prevTasks);
      setSelectedTask(prevSelected);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((err as any)?.response?.status === 400) setError('Bad request when completing task (400)');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else if ((err as any)?.response?.status === 404) setError('Work order not found (404)');
      else setError('Failed to complete task — please try again');
    }
  };

  // compute selected task view from effectiveTasks (which already applies local overrides)
  const visibleSelectedTask = selectedTask ? (effectiveTasks.find(t => t.id === selectedTask.id) ?? selectedTask) : selectedTask;

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
          <div className="mt-6 flex items-center justify-center">
            <Image
              src="/employee.png"
              alt="Employee"
              width={760}
              height={260}
              className="object-cover rounded-lg border border-gray-000"
            />
          </div>
        </div>

        <div className="lg:col-span-4">
          <TaskList
              tasks={filteredTasks}
              onTaskSelect={(task: Task) => setSelectedTask(task)}
              selectedTask={visibleSelectedTask}
              filters={filters}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
          />
        </div>

        <div className="lg:col-span-5">
          <TaskDetailPanel task={visibleSelectedTask} onStart={handleStartTask} onComplete={handleCompleteTask} onRefresh={fetchWorkOrders} />
        </div>
      </div>
    </div>
  );
}
