'use client';

import { useState } from 'react';
import { Car, Plus, X, Check } from 'lucide-react';
import type { CarDetails } from '../types';
import axiosInstance from '@/app/lib/axios';

interface CarDetailsFormProps {
  onAddCar: (car: CarDetails) => void;
  existingCars: CarDetails[];
}

export default function CarDetailsForm({ onAddCar, existingCars }: CarDetailsFormProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CarDetails>>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    color: '',
    mileage: '',
    vinNumber: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CarDetails, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CarDetails, string>> = {};

    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.model) newErrors.model = 'Model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.licensePlate) newErrors.licensePlate = 'License plate is required';
    if (!formData.color) newErrors.color = 'Color is required';

    // Check for duplicate license plate
    if (existingCars.some(car => car.licensePlate.toLowerCase() === formData.licensePlate?.toLowerCase())) {
      newErrors.licensePlate = 'This license plate is already registered';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      // Prepare API payload (mapping brand to make as per API spec)
      const apiPayload = {
        licensePlate: formData.licensePlate!.toUpperCase(),
        make: formData.brand!,
        model: formData.model!,
        year: formData.year!,
        color: formData.color!,
        ...(formData.vinNumber && { vinNumber: formData.vinNumber }),
        ...(formData.mileage && { mileage: parseInt(formData.mileage) }),
      };

      // Get token from localStorage for verification
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) {
        setApiError('Authentication token not found. Please login again.');
        setIsLoading(false);
        return;
      }

      // Debug: Log the request details
      console.log('API Request Details:');
      console.log('Payload:', apiPayload);
      console.log('Token exists:', !!token);
      console.log('Base URL:', process.env.NEXT_PUBLIC_BASE_URL);
      console.log('Full URL:', `${process.env.NEXT_PUBLIC_BASE_URL}/api/customer/vehicles`);

      // Make API call - Bearer token is automatically added by axiosInstance interceptor
      const response = await axiosInstance.post('/api/customer/vehicles', apiPayload);

      // Create car object from API response (assuming API returns the created vehicle)
      const newCar: CarDetails = {
        id: response.data.id || `car-${Date.now()}`,
        brand: response.data.make || formData.brand!,
        model: response.data.model || formData.model!,
        year: response.data.year || formData.year!,
        licensePlate: response.data.licensePlate || formData.licensePlate!.toUpperCase(),
        color: response.data.color || formData.color!,
        mileage: response.data.mileage?.toString(),
        vinNumber: response.data.vinNumber,
      };

      onAddCar(newCar);
      resetForm();
      setIsFormOpen(false);
    } catch (error: any) {
      console.error('Error adding vehicle:', error);
      
      let errorMessage = 'Failed to add vehicle. Please try again.';
      
      if (error.code === 'ERR_NETWORK' || error.message?.includes('ERR_FAILED')) {
        errorMessage = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8080';
      } else if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      color: '',
      mileage: '',
      vinNumber: '',
    });
    setErrors({});
    setApiError(null);
  };

  const handleCancel = () => {
    resetForm();
    setIsFormOpen(false);
  };

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">My Vehicles</h2>
          </div>
          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Vehicle</span>
            </button>
          )}
        </div>

        {existingCars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {existingCars.map((car) => (
              <div
                key={car.id}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-orange-500/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">{car.year}</p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-300">
                        <span className="font-medium">Plate:</span> {car.licensePlate}
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="font-medium">Color:</span> {car.color}
                      </p>
                      {car.mileage && (
                        <p className="text-sm text-gray-300">
                          <span className="font-medium">Mileage:</span> {car.mileage} km
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {existingCars.length === 0 && !isFormOpen && (
          <div className="text-center py-8 text-gray-400">
            <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No vehicles added yet. Add your first vehicle to get started.</p>
          </div>
        )}

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-lg p-6 space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    errors.brand ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-orange-500'
                  }`}
                  placeholder="e.g., Toyota"
                />
                {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    errors.model ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-orange-500'
                  }`}
                  placeholder="e.g., Camry"
                />
                {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    errors.year ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-orange-500'
                  }`}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  License Plate *
                </label>
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                  className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    errors.licensePlate ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-orange-500'
                  }`}
                  placeholder="ABC-1234"
                />
                {errors.licensePlate && <p className="text-red-500 text-xs mt-1">{errors.licensePlate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color *
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className={`w-full px-4 py-2 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    errors.color ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-orange-500'
                  }`}
                  placeholder="e.g., Black"
                />
                {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mileage (Optional)
                </label>
                <input
                  type="text"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="50000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  VIN Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.vinNumber}
                  onChange={(e) => setFormData({ ...formData, vinNumber: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="17 characters"
                  maxLength={17}
                />
              </div>
            </div>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                <p className="text-sm">{apiError}</p>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                <span>{isLoading ? 'Adding...' : 'Add Vehicle'}</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

