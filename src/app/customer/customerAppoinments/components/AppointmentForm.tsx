'use client';

import { useState } from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import type { CarDetails, Appointment } from '../types';
import axiosInstance from '@/app/lib/axios';

interface AppointmentFormProps {
  cars: CarDetails[];
  onBookAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => void;
}

export default function AppointmentForm({ cars, onBookAppointment }: AppointmentFormProps) {
  const [selectedCarId, setSelectedCarId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Project details (always required for this form)
  const [projectTitle, setProjectTitle] = useState('');
  const [projectEstimatedCost, setProjectEstimatedCost] = useState('');
  const [projectEstimatedCompletion, setProjectEstimatedCompletion] = useState('');

  const selectedCar = cars.find(c => c.id === selectedCarId);

  const availableTimeSlots = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Tomorrow is the earliest
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2); // 2 months ahead
    return maxDate.toISOString().split('T')[0];
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedCarId) newErrors.car = 'Please select a vehicle';
    if (!appointmentDate) newErrors.date = 'Please select a date';
    if (!appointmentTime) newErrors.time = 'Please select a time';
    if (!projectTitle) newErrors.projectTitle = 'Please provide a project title';
    if (!projectEstimatedCost) newErrors.projectEstimatedCost = 'Please provide estimated cost';
    if (!projectEstimatedCompletion) newErrors.projectEstimatedCompletion = 'Please provide estimated completion';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!cars || cars.length === 0) return;
    if (!selectedCar) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Combine date and time into ISO string (local time)
      const dateTimeIso = new Date(`${appointmentDate}T${appointmentTime}:00`).toISOString();

      // 1) Create appointment
      await axiosInstance.post('/api/customer/appointments', {
        vehicleId: Number(selectedCarId),
        appointmentDate: dateTimeIso,
      });

      // 2) Create a WORK ORDER for the project/modification
      await axiosInstance.post('/api/customer/work-orders', {
        vehicleId: Number(selectedCarId),
        type: 'PROJECT',
        title: projectTitle,
        description: description || 'Project work order requested with appointment',
        estimatedCost: Number(projectEstimatedCost),
        estimatedCompletion: new Date(projectEstimatedCompletion).toISOString(),
      });

      // Update local UI list as before
    const appointmentData: Omit<Appointment, 'id' | 'status' | 'createdAt'> = {
      carId: selectedCarId,
      carDetails: selectedCar,
        serviceType: 'project',
      appointmentDate,
      appointmentTime,
      description,
        priority: Number(projectEstimatedCost) > 250 ? 'high' : 'medium',
        estimatedCost: Number(projectEstimatedCost)
    };
    onBookAppointment(appointmentData);
    resetForm();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || err?.message || 'Failed to create appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCarId('');
    setAppointmentDate('');
    setAppointmentTime('');
    setDescription('');
    setProjectTitle('');
    setProjectEstimatedCost('');
    setProjectEstimatedCompletion('');
    setErrors({});
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Book Appointment</h2>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>Please add a vehicle first to book an appointment.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Vehicle *
            </label>
            <select
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                errors.car ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-orange-500'
              }`}
            >
              <option value="">Choose a vehicle...</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model} ({car.year}) - {car.licensePlate}
                </option>
              ))}
            </select>
            {errors.car && <p className="text-red-500 text-xs mt-1">{errors.car}</p>}
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                  errors.projectTitle ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-orange-500'
                }`}
                placeholder="e.g., Custom Body Kit Installation"
              />
              {errors.projectTitle && (
                <p className="text-red-500 text-xs mt-1">{errors.projectTitle}</p>
              )}
            </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Cost *
            </label>
              <input
                type="number"
                min="0"
                value={projectEstimatedCost}
                onChange={(e) => setProjectEstimatedCost(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                  errors.projectEstimatedCost ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-orange-500'
                }`}
                placeholder="2500"
              />
              {errors.projectEstimatedCost && (
                <p className="text-red-500 text-xs mt-1">{errors.projectEstimatedCost}</p>
                      )}
                    </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Completion *
              </label>
              <input
                type="datetime-local"
                value={projectEstimatedCompletion}
                onChange={(e) => setProjectEstimatedCompletion(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                  errors.projectEstimatedCompletion ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-orange-500'
                }`}
              />
              {errors.projectEstimatedCompletion && (
                <p className="text-red-500 text-xs mt-1">{errors.projectEstimatedCompletion}</p>
              )}
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Appointment Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 pr-4 ${
                    errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-orange-500'
                  }`}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Slot *
              </label>
              <select
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                  errors.time ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-orange-500'
                }`}
              >
                <option value="">Select time...</option>
                {availableTimeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="Any specific issues or details you'd like us to know about..."
            />
          </div>

          

          {/* Cost Summary */}
          {projectEstimatedCost && (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-orange-400" />
                <h3 className="font-semibold text-white">Estimated Cost</h3>
              </div>
              <p className="text-2xl font-bold text-orange-500">${projectEstimatedCost}</p>
            </div>
          )}

          {/* Submit Button */}
          {submitError && (
            <div className="text-red-500 text-sm">{submitError}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-semibold text-lg shadow-lg shadow-orange-500/20 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      )}
    </div>
  );
}

