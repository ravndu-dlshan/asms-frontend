'use client';

import { useState } from 'react';
import { Calendar, Clock, Car, MapPin, AlertCircle, CheckCircle, XCircle, Loader, DollarSign, FileText } from 'lucide-react';
import type { Appointment } from '../types';

interface AppointmentListProps {
  appointments: Appointment[];
  onCancelAppointment?: (appointmentId: string) => void;
}

export default function AppointmentList({ appointments, onCancelAppointment }: AppointmentListProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const statusOptions = [
    { value: 'all', label: 'All Appointments', color: 'text-gray-400' },
    { value: 'pending', label: 'Pending', color: 'text-yellow-400' },
    { value: 'confirmed', label: 'Confirmed', color: 'text-blue-400' },
    { value: 'in-progress', label: 'In Progress', color: 'text-purple-400' },
    { value: 'completed', label: 'Completed', color: 'text-green-400' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-400' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
      case 'in-progress':
        return <Loader className="w-5 h-5 text-purple-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
      case 'confirmed':
        return 'border-blue-500 bg-blue-500/10 text-blue-400';
      case 'in-progress':
        return 'border-purple-500 bg-purple-500/10 text-purple-400';
      case 'completed':
        return 'border-green-500 bg-green-500/10 text-green-400';
      case 'cancelled':
        return 'border-red-500 bg-red-500/10 text-red-400';
      default:
        return 'border-gray-500 bg-gray-500/10 text-gray-400';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const filteredAppointments = selectedStatus === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === selectedStatus);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">My Appointments</h2>
        </div>
        <span className="text-sm text-gray-400">
          {filteredAppointments.length} {filteredAppointments.length === 1 ? 'appointment' : 'appointments'}
        </span>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedStatus(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedStatus === option.value
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">No appointments found</p>
          <p className="text-sm">
            {selectedStatus === 'all' 
              ? 'Start by booking your first appointment!' 
              : `No ${selectedStatus} appointments at the moment.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-orange-500/30 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Left Section - Appointment Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(appointment.status)}
                      <h3 className="text-xl font-bold text-white">{appointment.serviceType}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      {appointment.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(appointment.priority)}`}>
                          {appointment.priority}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Car className="w-4 h-4 text-orange-400" />
                      <span className="font-medium">
                        {appointment.carDetails.brand} {appointment.carDetails.model} ({appointment.carDetails.year})
                      </span>
                    </div>
                    <div className="text-gray-400">
                      Plate: {appointment.carDetails.licensePlate}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span>{appointment.appointmentTime}</span>
                    </div>
                    {appointment.estimatedCost && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-orange-400" />
                        <span className="font-semibold text-orange-400">${appointment.estimatedCost}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {appointment.description && (
                    <div className="flex items-start space-x-2 pt-2 border-t border-gray-700">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-400">{appointment.description}</p>
                    </div>
                  )}
                </div>

                {/* Right Section - Actions */}
                {(appointment.status === 'pending' || appointment.status === 'confirmed') && onCancelAppointment && (
                  <div className="flex flex-col gap-2 md:w-auto w-full">
                    <button
                      onClick={() => onCancelAppointment(appointment.id)}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

