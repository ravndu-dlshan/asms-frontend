// src/app/employee/upcoming-tasks/components/TaskDetailPanel.tsx
'use client';

import { Car, User, MapPin, Calendar, Clock, FileText, Wrench, AlertCircle, Phone, Mail } from 'lucide-react';
import { formatDateTime, getPriorityColor, getStatusColor } from '../../utils';
import type { Task } from '../types';

interface TaskDetailPanelProps {
  task: Task | null;
}

export default function TaskDetailPanel({ task }: TaskDetailPanelProps) {
  if (!task) {
    return (
      <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 flex flex-col items-center justify-center h-full">
        <AlertCircle className="w-16 h-16 text-gray-600 mb-4" />
        <p className="text-gray-400 text-lg font-medium">Select a task to view details</p>
        <p className="text-gray-500 text-sm mt-2">Click on any task card to see more information</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{task.title}</h2>
            <p className="text-gray-400 text-sm">{task.id}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(task.status ?? 'scheduled')}`}>
            {task.status ?? 'scheduled'}
          </span>
        </div>
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority ?? 'medium')}`}>
          {task.priority ?? 'medium'} Priority
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Vehicle Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
            <Car className="w-4 h-4 mr-2" />
            Vehicle Information
          </h3>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-white font-semibold text-lg">{task.vehicleModel}</p>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Customer Information
          </h3>
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Name</span>
              <span className="text-white font-medium">{task.customerName}</span>
            </div>
            {task.customerPhone && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm flex items-center">
                  <Phone className="w-3 h-3 mr-2" />
                  Phone
                </span>
                <a href={`tel:${task.customerPhone}`} className="text-orange-400 font-medium hover:text-orange-300">
                  {task.customerPhone}
                </a>
              </div>
            )}
            {task.customerEmail && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm flex items-center">
                  <Mail className="w-3 h-3 mr-2" />
                  Email
                </span>
                <a href={`mailto:${task.customerEmail}`} className="text-orange-400 font-medium hover:text-orange-300">
                  {task.customerEmail}
                </a>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm flex items-center">
                <MapPin className="w-3 h-3 mr-2" />
                Location
              </span>
              <span className="text-white font-medium">{task.location}</span>
            </div>
          </div>
        </div>

        {/* Schedule Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </h3>
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Scheduled Time</span>
              <span className="text-white font-medium">{formatDateTime(task.scheduledTime)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm flex items-center">
                <Clock className="w-3 h-3 mr-2" />
                Est. Duration
              </span>
              <span className="text-white font-medium">{task.estimatedDuration}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Description
          </h3>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-300 text-sm leading-relaxed">{task.description}</p>
          </div>
        </div>

        {/* Required Parts */}
        {task.requiredParts && task.requiredParts.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
              <Wrench className="w-4 h-4 mr-2" />
              Required Parts
            </h3>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <ul className="space-y-2">
                {task.requiredParts.map((part, index) => (
                  <li key={index} className="flex items-center space-x-3 text-gray-300 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>{part}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Special Instructions */}
        {task.specialInstructions && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Special Instructions
            </h3>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <p className="text-orange-300 text-sm leading-relaxed">{task.specialInstructions}</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="p-6 border-t border-gray-800 bg-gray-800/30">
        <div className="flex items-center space-x-3">
          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg shadow-orange-500/30">
            Start Task
          </button>
          <button className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium border border-gray-700">
            Postpone
          </button>
        </div>
      </div>
    </div>
  );
}