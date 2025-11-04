'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import type { CarDetails, ServiceRecord } from '../types';
import { CreateAppointment, CreateWorkOrder } from '../services/appointmentService';


interface AppointmentFormProps {
  service: ServiceRecord;
  cars: CarDetails[];
}

export default function AppointmentForm({ cars, service }: AppointmentFormProps) {
  const [selectedCarId, setSelectedCarId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      await CreateAppointment(Number(selectedCarId), dateTimeIso)

      const workOrder = {
        vehicleId: Number(selectedCarId),
        type: 'SERVICE',
        title: service.title,
        description: description || 'Project work order requested with appointment',
        estimatedCost: Number(service.price.replace(/[^0-9\-–]/g, '').split('–')[0].trim()),
      }

      // 2) Create a WORK ORDER for the project/modification
      await CreateWorkOrder(workOrder)

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
        <>
          {/* Selected Service Details */}
          {service && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 md:flex items-center gap-6 shadow-md">
              {/* Service Image */}
              <div className="w-full md:w-1/3 flex justify-center">
                <img
                  src={service.image}
                  alt={service.title}
                  className="rounded-lg object-cover w-full h-48 md:h-56 border border-gray-700"
                />
              </div>

              {/* Service Info */}
              <div className="flex-1 mt-4 md:mt-0">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                  {service.price && (
                    <p className="text-orange-400 font-medium text-lg">
                      Estimated Price:{" "}
                      <span className="text-white">{service.price}</span>
                    </p>
                  )}
                  {service.estimatedTime && (
                    <p className="text-emerald-400 font-medium text-lg mt-2 sm:mt-0">
                      Estimated Time:{" "}
                      <span className="text-white">{service.estimatedTime}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mt-5">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Vehicle *
              </label>
              <select
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 ${errors.car ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-orange-500'
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
                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 pr-4 ${errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-orange-500'
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
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 ${errors.time ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-orange-500'
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

        </>
      )}
    </div>
  );
}

