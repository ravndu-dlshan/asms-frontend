'use client';

import { DollarSign, Clock, TrendingUp, Award } from 'lucide-react';
import WorkLogTable from './components/WorkLogTable';
import TimeTracker from './components/TimeTracker';
import { useEffect, useState } from 'react'; // Removed unused `useMemo`
import axiosInstance from '@/app/lib/axios';
import type { Task } from '../upcoming-tasks/types';
import { createTimeLog, getTimeLogsForWorkOrder } from '@/app/api/timeLogService';

interface WorkLog {
  id: string;
  // accept both snake_case and camelCase shapes from backend
  work_order_id?: string | number;
  workOrderId?: string | number;
  title?: string;
  serviceType?: string;
  start_time?: string | null;
  startTime?: string | null;
  end_time?: string | null;
  endTime?: string | null;
  duration_minutes?: number | null;
  durationMinutes?: number | null;
  final_cost?: number | null;
  finalCost?: number | null;
  notes?: string | null;
}
import PerformanceChart from './components/PerformanceChart';

export default function WorkLogPage() {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  // map of work_order_id -> startTime ISO string
  const [runningMap, setRunningMap] = useState<Record<string, string | null>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    const fetchLogs = async () => {
      setLoading(true);
      try {
        // Use mock values for testing if dynamic values are unavailable
        const workOrderId = '1'; // Replace with actual workOrderId dynamically
        const employeeId = 2; // Replace with dynamic employeeId if available

        if (!workOrderId || !employeeId) {
          console.warn('Missing workOrderId or employeeId. Skipping fetchLogs.');
          setError('Missing workOrderId or employeeId.');
          setLoading(false);
          return;
        }

        const data = await getTimeLogsForWorkOrder(workOrderId, employeeId);
        console.log('API Response for Time Logs:', data); // Debugging log
        if (!mounted) return;
        setWorkLogs(Array.isArray(data) ? data : []);
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err: any = e;
        console.warn('Failed to fetch worklogs', err);
        setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load worklogs');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchLogs();
    // also fetch assigned tasks for Start/Stop controls
    const fetchAssigned = async () => {
      try {
        const r = await axiosInstance.get('/api/work-orders/my-assigned');
        const d = r?.data?.data ?? r?.data ?? [];
        if (mounted) setAssignedTasks(Array.isArray(d) ? d.map((w: Record<string, unknown>) => {
          const id = String(w['id']);
          const title = (w['title'] ?? w['type'] ?? 'Work Order') as string;
          const vehicleModel = String(w['vehicleDetails'] ?? '');
          const customerName = String(w['customerName'] ?? '');
          const scheduledTime = String(w['estimatedCompletion'] ?? w['createdAt'] ?? new Date().toISOString());
          const status = w['status'] ? String(w['status']).toLowerCase() : 'scheduled';
          const description = String(w['description'] ?? w['statusMessage'] ?? '');
          const estimatedCost =
            typeof w['estimatedCost'] === 'number'
              ? (w['estimatedCost'] as number)
              : typeof w['estimatedCost'] === 'string'
              ? Number(w['estimatedCost'] as string)
              : null;

          return {
            id,
            title,
            vehicleModel,
            customerName,
            location: '',
            scheduledTime,
            estimatedDuration: '',
            priority: '',
            status,
            description,
            estimatedCost,
          };
        }) : []);
      } catch (e) {
        console.warn('Failed to fetch assigned tasks', e);
      }
    };
    fetchAssigned();
    return () => { mounted = false; };
  }, []);

  const totalHours = workLogs.reduce((sum, log) => sum + ((log.durationMinutes ?? 0) / 60), 0);
  const totalBasePay = workLogs.reduce((sum, log) => sum + (log.finalCost ?? 0), 0);
  const totalBonus = 0;
  const totalOvertime = 0;

  const averageSalary = workLogs.length > 0 ? (totalBasePay / workLogs.length).toFixed(2) : '0.00';
  const averageWorkTime = workLogs.length > 0 ? (totalHours / workLogs.length).toFixed(2) : '0.00';

  const stats = [
    {
      label: 'Total Hours (Week)',
      value: totalHours.toFixed(1),
      subtext: '+2.5 from last week',
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      trend: 'up'
    },
    {
      label: 'Avg Hours/Job',
      value: '3.2',
      subtext: 'Efficiency: 95%',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      trend: 'up'
    },
    {
      label: 'Estimated Pay',
      value: `${totalBasePay + totalBonus}`,
      subtext: `+${totalBonus} bonus`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-400',
      trend: 'up'
    },
    {
      label: 'Overtime Hours',
      value: (totalOvertime / 15).toFixed(1),
      subtext: '1.5x rate applied',
      icon: Award,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      trend: 'neutral'
    }
  ];

  const leftSideStats = [
    {
      label: 'Average Salary',
      value: `LKR ${averageSalary}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-400',
    },
    {
      label: 'Average Work Time',
      value: `${averageWorkTime} hrs`,
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Work Log & Time Tracking</h1>
        <p className="text-gray-400">Monitor your service hours and earnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leftSideStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <p className="text-gray-400">Loading work logs...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-900 rounded-xl p-4 border border-red-800 text-center">
          <p className="text-red-200">Error loading work logs: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                {stat.trend === 'up' && (
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <TimeTracker />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <PerformanceChart
            logs={workLogs.map(w => ({
              ...w,
              start_time: (w.start_time ?? w.startTime ?? new Date().toISOString()) as string,
              duration_minutes: (w.duration_minutes ?? w.durationMinutes ?? 0) as number,
            }))}
          />

          {/* Assigned tasks list with Start/Stop */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 w-full">
            <h3 className="text-xl font-bold text-white mb-3">Assigned Tasks</h3>
            <p className="text-gray-400 text-sm mb-4">Start/Stop timers for your assigned work orders. These logs are used for tracking only.</p>
            <div className="space-y-4">
              {assignedTasks.length === 0 ? (
                <div className="text-gray-400">No assigned tasks</div>
              ) : assignedTasks.map((task) => {
                const running = runningMap[task.id];
                return (
                  <div key={task.id} className="bg-gray-800/30 rounded-lg p-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{task.title}</div>
                          <div className="text-gray-400 text-sm">{task.vehicleModel} — {task.customerName}</div>
                        </div>
                        <div className="text-sm text-gray-300">Fee: <span className="text-white font-semibold">{task.estimatedCost ? `LKR ${task.estimatedCost}` : '-'}</span></div>
                      </div>

                      <div className="mt-3 flex items-center space-x-3">
                        {!running ? (
                          <button
                            onClick={() => {
                              const now = new Date().toISOString();
                              setRunningMap(prev => ({ ...prev, [task.id]: now }));
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg"
                          >Start</button>
                        ) : (
                          <button
                            onClick={async () => {
                              const start = runningMap[task.id];
                              const end = new Date().toISOString();
                              const notes = notesMap[task.id] ?? '';
                              const employeeId = 2; // Replace with dynamic employeeId if available
                              // POST time log
                              try {
                                const created = await createTimeLog({
                                  work_order_id: task.id,
                                  start_time: start,
                                  end_time: end,
                                  notes: notes || null,
                                  employeeId,
                                });
                                // compute duration safely only if start exists
                                const durationMinutes = start ? (new Date(end).getTime() - new Date(start).getTime()) / 60000 : null;
                                // append to workLogs
                                setWorkLogs(prev =>
                                  created
                                    ? [created, ...prev]
                                    : [
                                        {
                                          id: `tmp-${Date.now()}`,
                                          work_order_id: task.id,
                                          title: task.title,
                                          start_time: start,
                                          end_time: end,
                                          duration_minutes: durationMinutes,
                                          notes: notes || null,
                                        },
                                        ...prev,
                                      ]
                                );
                              } catch (e) {
                                console.error('Failed to post time log', e);
                              } finally {
                                // clear running and notes
                                setRunningMap(prev => ({ ...prev, [task.id]: null }));
                                setNotesMap(prev => ({ ...prev, [task.id]: '' }));
                              }
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg"
                          >Stop</button>
                        )}

                        <input
                          value={notesMap[task.id] ?? ''}
                          onChange={(e) => setNotesMap(prev => ({ ...prev, [task.id]: e.target.value }))}
                          placeholder="Optional note"
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <WorkLogTable logs={workLogs} />
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4">Company Offers & Incentives</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="text-green-400 font-bold mb-1">Service Champion</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Complete 20+ services this month for $200 bonus
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs text-green-400 font-semibold">15/20</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Progress: 75%</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-blue-400 font-bold mb-1">Efficiency Expert</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Maintain 90%+ efficiency for weekly $50 bonus
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-xs text-blue-400 font-semibold">95%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Current: 95% ✓</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h4 className="text-orange-400 font-bold mb-1">Quality First</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Zero rework jobs this week for $75 bonus
                </p>
                <p className="text-xs text-orange-400 font-semibold mt-3">Status: On track ✓</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}