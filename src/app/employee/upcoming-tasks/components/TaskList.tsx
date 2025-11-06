'use client';

import React from 'react';
import TaskCard from './TaskCard';
import { Search } from 'lucide-react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  selectedTask: Task | null;
  filters: {
    status: string;
    date: string;
  };
  // lifted search state so parent can compute counts based on search as well
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function TaskList({ tasks, onTaskSelect, selectedTask, filters, searchTerm, onSearchChange }: TaskListProps) {

  const filteredTasks = tasks.filter(task => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q || task.title.toLowerCase().includes(q) || task.vehicleModel.toLowerCase().includes(q) || task.customerName.toLowerCase().includes(q);

    const matchesStatus = filters.status === 'all' || task.status === filters.status;

    let matchesDate = true;
    if (filters.date !== 'all') {
      const taskDate = new Date(task.scheduledTime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (filters.date) {
        case 'today':
          matchesDate = taskDate.toDateString() === today.toDateString();
          break;
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          matchesDate = taskDate.toDateString() === tomorrow.toDateString();
          break;
        case 'this-week':
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          matchesDate = taskDate >= today && taskDate <= weekEnd;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks by title, vehicle, or customer..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Showing <span className="text-white font-semibold">{filteredTasks.length}</span> task{filteredTasks.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onSelect={onTaskSelect}
              isSelected={selectedTask?.id === task.id}
            />
          ))
        ) : (
          <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
            <p className="text-gray-400 text-lg font-medium">No tasks found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  );
}