// src/app/employee/upcoming-tasks/components/TaskDetailPanel.tsx
'use client';

import { useState } from 'react';
// router navigation removed: using window.open for external tab navigation to keep modal open
import { Car, User, MapPin, Calendar, Clock, FileText, Wrench, AlertCircle, AlertTriangle, Phone, Mail, Check } from 'lucide-react';
import ErrorPopUp from '@/app/components/ErrorPopuUp';
import axiosInstance from '@/app/lib/axios';
import { formatDateTime, getPriorityColor, getStatusColor, formatCurrencyLKR } from '../../utils';
import type { Task } from '../types';

interface TaskDetailPanelProps {
  task: Task | null;
  onStart?: (task: Task) => Promise<void>;
  onComplete?: (task: Task) => Promise<void>;
  // optional callback to let parent refresh the list after a successful update
  onRefresh?: () => Promise<Task[] | void>;
}

export default function TaskDetailPanel({ task, onStart, onComplete, onRefresh }: TaskDetailPanelProps) {
  const [showStartModal, setShowStartModal] = useState(false);
  // no router needed here
  const [startConfirmed, setStartConfirmed] = useState(false);
  const [completedConfirmed, setCompletedConfirmed] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMsg, setPopupMsg] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // helper to map status to step index
  const statusToStep = (status?: string | null) => {
    if (!status) return 0;
    const s = String(status).toLowerCase();
    if (s === 'scheduled' || s === 'unassigned') return 0;
    // treat 'assigned' as scheduled (0) per updated UX rules; only 'in-progress' maps to step 1
    if (s === 'in-progress') return 1;
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
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative w-full max-w-2xl mx-4 bg-gray-900 rounded-xl border border-gray-800 p-6 z-10">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-white mb-4">Start Task</h3>
              <button
                aria-label="Close"
                onClick={() => { setShowStartModal(false); setStartConfirmed(false); setCompletedConfirmed(false); }}
                className="ml-4 text-gray-300 hover:text-white rounded-md p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-400 mb-4">This shows the task progress stages. You can either start the task here or open the time tracker to track your working time.</p>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-6">
              {['Scheduled', 'In Progress', 'Completed'].map((label, idx) => {
                const serverStep = statusToStep(task?.status); // 0,1,2 based on actual task.status
                // if user just confirmed start locally, show up to In Progress (1) even if serverStep is 0
                let displayedStep = serverStep;
                if (startConfirmed && serverStep < 1) displayedStep = 1;
                if (completedConfirmed) displayedStep = 2;

                // mark completed only when server indicates completed or we just confirmed completion locally
                const completed = serverStep === 2 || completedConfirmed;
                const active = idx <= displayedStep;
                return (
                  <div key={label} className="flex-1 flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${active ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                      {completed && idx <= 2 ? <Check className="w-5 h-5" /> : <span className="font-semibold">{idx + 1}</span>}
                    </div>
                    <div className="ml-3 text-sm text-gray-300">{label}</div>
                    {idx < 2 && <div className={`flex-1 h-0.5 mx-3 ${idx < displayedStep ? 'bg-orange-500' : 'bg-gray-700'}`} />}
                  </div>
                );
              })}
            </div>

            {/* success message shown after confirming start */}
            {successMessage ? (
              <div className="mb-4 p-3 rounded-lg bg-green-900/60 border border-green-800 text-green-200 flex items-start justify-between">
                <div>{successMessage}</div>
                <button onClick={() => setSuccessMessage('')} className="ml-4 text-sm text-green-100 underline">Dismiss</button>
              </div>
            ) : startConfirmed && (
              <div className="mb-4 p-3 rounded-lg bg-green-900/60 border border-green-800 text-green-200">
                Task started — good luck with your work!
              </div>
            )}

            {/* compute current server step to determine which actions to show */}
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  // open work-log in a new tab with prefilled details and autoStart so this modal remains open
                  const params = new URLSearchParams();
                  params.set('title', task.title ?? '');
                  params.set('description', task.description ?? '');
                  params.set('autoStart', 'true');
                  const url = `/employee/work-log?${params.toString()}`;
                  // open new tab/window; keep modal open in current tab
                  if (typeof window !== 'undefined') {
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium border border-gray-700"
              >
                Track my working time (opens in new tab)
              </button>
              {/* Decide which action buttons to show based on server status and local confirmations */}
              {(() => {
                const serverStep = statusToStep(task?.status);
                const isInProgress = serverStep === 1 || startConfirmed;
                const isCompleted = serverStep === 2 || completedConfirmed;

                // If not yet in-progress, show Confirm Start
                if (!isInProgress && !isCompleted) {
                  return (
                    <button
                      onClick={async () => {
                        // set local in-flight and call parent handler if provided; otherwise perform PUT here
                        setIsStarting(true);
                        try {
                          console.log(`Starting task via UI: id=${task.id}`);
                          if (onStart) {
                            console.log('Delegating start to parent onStart handler');
                            await onStart(task);
                          } else {
                            console.log('No parent onStart provided — calling backend directly');
                            const body = { status: 'IN_PROGRESS' };
                            console.log('PUT', `/api/work-orders/${task.id}/status`, body);
                            const res = await axiosInstance.put(`/api/work-orders/${task.id}/status`, body, { headers: { 'Content-Type': 'application/json' } });
                            console.log('Start response', res?.status, res?.data);
                          }
                          setStartConfirmed(true);
                          // show exact persistent success message required and keep modal open
                          setSuccessMessage('✅ Work started! Good luck �');
                          // refresh parent list if available
                          if (typeof onRefresh === 'function') {
                            try {
                              await onRefresh();
                            } catch (e) {
                              console.warn('onRefresh failed', e);
                            }
                          }
                        } catch (err) {
                          // show popup on error
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const e: any = err;
                          console.error('Error starting task', e);
                          setPopupMsg(e?.response?.data?.message ?? e?.message ?? 'Failed to start task');
                          setPopupOpen(true);
                          setStartConfirmed(false);
                        } finally {
                          setIsStarting(false);
                        }
                      }}
                      disabled={isStarting || startConfirmed}
                      className={`px-4 py-2 ${isStarting || startConfirmed ? 'bg-green-700 text-white/80' : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'} rounded-lg transition-all font-medium`}
                    >
                      {isStarting ? 'Starting...' : startConfirmed ? 'Started ✓' : 'Confirm Start'}
                    </button>
                  );
                }

                // If in-progress (server or local), show Mark Completed button
                if (isInProgress && !isCompleted) {
                  return (
                    <button
                      onClick={async () => {
                        setIsCompleting(true);
                        try {
                          console.log(`Completing task via UI: id=${task.id}`);
                          if (onComplete) {
                            console.log('Delegating complete to parent onComplete handler');
                            await onComplete(task);
                          } else {
                            console.log('No parent onComplete provided — calling backend directly');
                            const body = { status: 'COMPLETED' };
                            console.log('PUT', `/api/work-orders/${task.id}/status`, body);
                            const res = await axiosInstance.put(`/api/work-orders/${task.id}/status`, body, { headers: { 'Content-Type': 'application/json' } });
                            console.log('Complete response', res?.status, res?.data);
                          }
                          setCompletedConfirmed(true);
                          // show exact persistent completion message and keep modal open
                          setSuccessMessage('🎉 Task Completed! Great work!');
                          // refresh parent list if available
                          if (typeof onRefresh === 'function') {
                            try {
                              await onRefresh();
                            } catch (e) {
                              console.warn('onRefresh failed', e);
                            }
                          }
                        } catch (err) {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const e: any = err;
                          console.error('Error completing task', e);
                          setPopupMsg(e?.response?.data?.message ?? e?.message ?? 'Failed to complete task');
                          setPopupOpen(true);
                          setCompletedConfirmed(false);
                        } finally {
                          setIsCompleting(false);
                        }
                      }}
                      disabled={isCompleting || completedConfirmed}
                      className={`px-4 py-2 ${isCompleting || completedConfirmed ? 'bg-indigo-700 text-white/80' : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700'} rounded-lg transition-all font-medium`}
                    >
                      {isCompleting ? 'Completing...' : completedConfirmed ? 'Completed ✓' : 'Mark Completed'}
                    </button>
                  );
                }

                // otherwise show simple Close
                return (
                  <button
                    onClick={() => {
                      // allow explicit close and clear local flags
                      setShowStartModal(false);
                      setStartConfirmed(false);
                      setCompletedConfirmed(false);
                    }}
                    className="px-3 py-2 text-sm text-gray-300"
                  >
                    Close
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      {/* Error popup shown when API calls fail */}
      <ErrorPopUp open={popupOpen} onClose={() => setPopupOpen(false)} title="Action failed" message={popupMsg} type="error" />
    </div>
  );
}