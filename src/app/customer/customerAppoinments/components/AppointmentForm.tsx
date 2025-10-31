'use client';

import { useState } from 'react';
import { Calendar, Clock, DollarSign, FileText } from 'lucide-react';
import type { CarDetails, Appointment, ServiceOption } from '../types';

interface AppointmentFormProps {
  cars: CarDetails[];
  onBookAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => void;
}

const serviceOptions: ServiceOption[] = [
  {
    id: 'maintenance',
    name: 'Maintenance Service',
    description: 'Regular maintenance including oil change, filter replacement, and inspection',
    estimatedDuration: '2-3 hours',
    estimatedCost: 150
  },
  {
    id: 'repair',
    name: 'Repair Service',
    description: 'Diagnostic and repair of vehicle issues',
    estimatedDuration: '3-6 hours',
    estimatedCost: 300
  },
  {
    id: 'diagnostic',
    name: 'Diagnostic Check',
    description: 'Comprehensive vehicle diagnostics and health check',
    estimatedDuration: '1-2 hours',
    estimatedCost: 80
  },
  {
    id: 'tire',
    name: 'Tire Service',
    description: 'Tire replacement, rotation, or alignment',
    estimatedDuration: '1-2 hours',
    estimatedCost: 100
  },
  {
    id: 'brake',
    name: 'Brake Service',
    description: 'Brake inspection, pad replacement, and fluid check',
    estimatedDuration: '2-3 hours',
    estimatedCost: 200
  },
  {
    id: 'battery',
    name: 'Battery Service',
    description: 'Battery testing, charging, or replacement',
    estimatedDuration: '30 min - 1 hour',
    estimatedCost: 120
  }
];

export default function AppointmentForm({ cars, onBookAppointment }: AppointmentFormProps) {
  const [selectedCarId, setSelectedCarId] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedService = serviceOptions.find(s => s.id === serviceType);
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
    if (!serviceType) newErrors.service = 'Please select a service type';
    if (!appointmentDate) newErrors.date = 'Please select a date';
    if (!appointmentTime) newErrors.time = 'Please select a time';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!cars || cars.length === 0) return;
    if (!selectedCar) return;

    const appointmentData: Omit<Appointment, 'id' | 'status' | 'createdAt'> = {
      carId: selectedCarId,
      carDetails: selectedCar,
      serviceType,
      appointmentDate,
      appointmentTime,
      description,
      priority: selectedService?.estimatedCost && selectedService.estimatedCost > 250 ? 'high' : 'medium',
      estimatedCost: selectedService?.estimatedCost
    };

    onBookAppointment(appointmentData);
    resetForm();
  };

  const resetForm = () => {
    setSelectedCarId('');
    setServiceType('');
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

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Service Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {serviceOptions.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setServiceType(service.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    serviceType === service.id
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{service.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{service.description}</p>
                      <div className="flex items-center space-x-4 text-xs">
                        <span className="text-gray-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {service.estimatedDuration}
                        </span>
                        <span className="text-orange-400 flex items-center font-medium">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${service.estimatedCost}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3 ${
                        serviceType === service.id
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-gray-600'
                      }`}
                    >
                      {serviceType === service.id && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {errors.service && (
              <p className="text-red-500 text-xs mt-1">{errors.service}</p>
            )}
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

          {/* Estimated Cost Summary */}
          {selectedService && (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-orange-400" />
                <h3 className="font-semibold text-white">Estimated Cost</h3>
              </div>
              <p className="text-2xl font-bold text-orange-500">${selectedService.estimatedCost}</p>
              <p className="text-sm text-gray-400 mt-1">
                Estimated duration: {selectedService.estimatedDuration}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-semibold text-lg shadow-lg shadow-orange-500/20 transform hover:scale-[1.02]"
          >
            Book Appointment
          </button>
        </form>
      )}
    </div>
  );
}

