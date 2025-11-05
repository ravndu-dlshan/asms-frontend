// src/app/employee/upcoming-tasks/components/TaskDetailPanel.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, User, MapPin, Calendar, Clock, FileText, Wrench, AlertCircle, AlertTriangle, Phone, Mail } from 'lucide-react';
import { formatDateTime, getPriorityColor, getStatusColor, formatCurrencyLKR } from '../../utils';
import type { Task } from '../types';

interface TaskDetailPanelProps {
  task: Task | null;
  onStart?: (task: Task) => Promise<void>;
}

export default function TaskDetailPanel({ task, onStart }: TaskDetailPanelProps) {
  const [showStartModal, setShowStartModal] = useState(false);
  const router = useRouter();

  // helper to map status to step index
  const statusToStep = (status?: string | null) => {
    if (!status) return 0;
    const s = String(status).toLowerCase();
    if (s === 'scheduled' || s === 'unassigned') return 0;
    if (s === 'in-progress' || s === 'assigned') return 1;
    if (s === 'completed' || s === 'done') return 2;
    return 0;
  };
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
            {/* id intentionally hidden per request */}
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(task.status ?? 'scheduled')}`}>
            {task.status ?? 'scheduled'}
          </span>
        </div>
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority ?? 'medium')}`}>
          {task.priority ?? 'medium'} Priority
        </span>

        {task.assignedEmployeeName && (
          <div className="mt-3 text-sm text-gray-300">Assigned to: <span className="text-white font-medium">{task.assignedEmployeeName}</span></div>
        )}
       
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
            {typeof task.estimatedCost === 'number' && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Estimated Cost</span>
                <span className="text-white font-medium">{formatCurrencyLKR(task.estimatedCost)}</span>
              </div>
            )}
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

        {task.statusMessage && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Status Message
            </h3>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-300 text-sm leading-relaxed">{task.statusMessage}</p>
            </div>
          </div>
        )}

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
          <button
            onClick={(e) => { e.stopPropagation(); setShowStartModal(true); }}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg shadow-orange-500/30"
          >
            Start Task
          </button>
        </div>
      </div>

      {/* Start modal */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowStartModal(false)} />
          <div className="relative w-full max-w-2xl mx-4 bg-gray-900 rounded-xl border border-gray-800 p-6 z-10">
            <h3 className="text-xl font-bold text-white mb-4">Start Task</h3>
            <p className="text-gray-400 mb-4">This shows the task progress stages. You can either start the task here or open the time tracker to track your working time.</p>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-6">
              {['Scheduled', 'In Progress', 'Completed'].map((label, idx) => {
                const active = idx <= statusToStep(task.status);
                return (
                  <div key={label} className="flex-1 flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${active ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                      {idx + 1}
                    </div>
                    <div className="ml-3 text-sm text-gray-300">{label}</div>
                    {idx < 2 && <div className={`flex-1 h-0.5 mx-3 ${idx < statusToStep(task.status) ? 'bg-orange-500' : 'bg-gray-700'}`} />}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  // navigate to work-log with prefilled details and autoStart
                  const params = new URLSearchParams();
                  params.set('title', task.title ?? '');
                  params.set('description', task.description ?? '');
                  params.set('autoStart', 'true');
                  router.push(`/employee/work-log?${params.toString()}`);
                  setShowStartModal(false);
                }}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium border border-gray-700"
              >
                Track my working time
              </button>

              <button
                onClick={async () => {
                  if (onStart) {
                    await onStart(task);
                  }
                  setShowStartModal(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium"
              >
                Confirm Start
              </button>

              <button onClick={() => setShowStartModal(false)} className="px-3 py-2 text-sm text-gray-300">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}