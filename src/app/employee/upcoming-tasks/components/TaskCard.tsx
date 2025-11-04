// src/app/employee/upcoming-tasks/components/TaskCard.tsx
'use client';

import { Calendar, Clock, Car, MapPin, Play, CheckCircle } from 'lucide-react';
import { formatDateTime, getPriorityColor, getStatusColor } from '../../utils';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  isSelected: boolean;
}

export default function TaskCard({ task, onSelect, isSelected }: TaskCardProps) {
  return (
    <div
      onClick={() => onSelect(task)}
      className={`bg-gray-900 rounded-xl p-6 border transition-all cursor-pointer hover:shadow-xl ${
        isSelected
          ? 'border-orange-500 shadow-lg shadow-orange-500/20'
          : 'border-gray-800 hover:border-gray-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-bold text-white">{task.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority ?? 'medium')}`}>
              {task.priority ?? 'medium'}
            </span>
          </div>
          <p className="text-gray-400 text-sm">{task.id}</p>
          {task.assignedEmployeeName && (
            <p className="text-gray-400 text-xs mt-1">Assigned: <span className="text-white">{task.assignedEmployeeName}</span></p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status ?? 'scheduled')}`}>
          {task.status ?? 'scheduled'}
        </span>
      </div>

      {/* Vehicle & Customer Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-3 text-gray-300">
          <Car className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <span className="text-sm font-medium">{task.vehicleModel}</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-300">
          <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <span className="text-sm">{task.customerName} • {task.location}</span>
        </div>
      </div>

      {/* Time Info */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-gray-800/50 rounded-lg mb-4">
        <div>
          <div className="flex items-center space-x-2 text-gray-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Scheduled</span>
          </div>
          <p className="text-sm text-white font-medium">{formatDateTime(task.scheduledTime)}</p>
        </div>
        <div>
          <div className="flex items-center space-x-2 text-gray-400 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Duration</span>
          </div>
          <p className="text-sm text-white font-medium">{task.estimatedDuration}</p>
        </div>
        {typeof task.estimatedCost === 'number' && (
          <div className="col-span-2 text-right text-sm text-gray-300">Est. Cost: <span className="text-white font-semibold">${task.estimatedCost.toFixed(2)}</span></div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{task.description}</p>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg shadow-orange-500/20">
          <Play className="w-4 h-4" />
          <span>Start Task</span>
        </button>
        <button className="px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium">
          <CheckCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}