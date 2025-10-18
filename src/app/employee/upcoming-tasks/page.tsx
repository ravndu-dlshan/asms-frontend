'use client';

import { useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import TaskList from './components/TaskList';
import TaskFilterPanel from './components/TaskFilterPanel';
import TaskDetailPanel from './components/TaskDetailPanel';
import type { Task } from './types';

export default function UpcomingTasksPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    date: 'all'
  });
  const tasks = [
    {
      id: 'TSK-2024-001',
      title: 'Oil Change & Filter Replacement',
      vehicleModel: 'Toyota Camry 2020',
      customerName: 'John Anderson',
      location: 'Bay 3',
      scheduledTime: '2024-10-17T09:00:00',
      estimatedDuration: '1.5 hours',
      priority: 'medium',
      status: 'scheduled',
      description: 'Regular oil change service with synthetic oil. Also replace oil filter and check fluid levels.',
      customerPhone: '+1 (555) 123-4567',
      customerEmail: 'john.anderson@email.com',
      requiredParts: ['Synthetic Oil 5W-30', 'Oil Filter', 'Drain Plug Gasket'],
      specialInstructions: 'Customer requested premium synthetic oil'
    },
    {
      id: 'TSK-2024-002',
      title: 'Brake System Inspection',
      vehicleModel: 'Honda Civic 2019',
      customerName: 'Sarah Mitchell',
      location: 'Bay 1',
      scheduledTime: '2024-10-17T11:00:00',
      estimatedDuration: '2 hours',
      priority: 'high',
      status: 'scheduled',
      description: 'Complete brake system inspection including pads, rotors, and fluid. Customer reported squeaking noise.',
      customerPhone: '+1 (555) 234-5678',
      customerEmail: 'sarah.m@email.com',
      requiredParts: ['Brake Pads (Front)', 'Brake Fluid'],
      specialInstructions: 'Check for unusual wear patterns on rotors'
    },
    {
      id: 'TSK-2024-003',
      title: 'Tire Rotation & Alignment',
      vehicleModel: 'Ford F-150 2021',
      customerName: 'Mike Roberts',
      location: 'Bay 2',
      scheduledTime: '2024-10-17T14:00:00',
      estimatedDuration: '1 hour',
      priority: 'low',
      status: 'scheduled',
      description: 'Rotate all four tires and perform wheel alignment check.',
      customerPhone: '+1 (555) 345-6789',
      customerEmail: 'mike.roberts@email.com',
      requiredParts: []
    },
    {
      id: 'TSK-2024-004',
      title: 'Engine Diagnostic',
      vehicleModel: 'BMW X5 2022',
      customerName: 'Emma Wilson',
      location: 'Bay 4',
      scheduledTime: '2024-10-17T16:00:00',
      estimatedDuration: '2.5 hours',
      priority: 'urgent',
      status: 'scheduled',
      description: 'Check engine light is on. Run full diagnostic scan and identify issues.',
      customerPhone: '+1 (555) 456-7890',
      customerEmail: 'emma.w@email.com',
      requiredParts: [],
      specialInstructions: 'Priority service - customer needs car by end of day'
    },
    {
      id: 'TSK-2024-005',
      title: 'AC System Recharge',
      vehicleModel: 'Mercedes C-Class 2020',
      customerName: 'David Brown',
      location: 'Bay 5',
      scheduledTime: '2024-10-18T10:00:00',
      estimatedDuration: '1 hour',
      priority: 'medium',
      status: 'scheduled',
      description: 'AC not cooling properly. Check for leaks and recharge refrigerant.',
      customerPhone: '+1 (555) 567-8901',
      customerEmail: 'david.brown@email.com',
      requiredParts: ['R-134a Refrigerant', 'AC Sealant']
    }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
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
