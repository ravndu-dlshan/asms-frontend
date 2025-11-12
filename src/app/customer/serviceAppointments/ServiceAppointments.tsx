'use client';

import { useState, useEffect } from 'react';
import CarDetailsForm from './components/CarDetailsForm';
import AppointmentForm from './components/AppointmentForm';
import type { CarDetails, Appointment, ServiceRecord } from './types';
import axiosInstance from '@/app/lib/axios';


interface ServiceProps {
  service: ServiceRecord;
}

const ServiceAppointments: React.FC<ServiceProps> = ({ service }) => {
  const [cars, setCars] = useState<CarDetails[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [vehicleError, setVehicleError] = useState<string | null>(null);

  // Fetch vehicles for the authenticated customer
  useEffect(() => {
    const fetchVehicles = async () => {
      setVehicleLoading(true);
      setVehicleError(null);
      try {
        const response = await axiosInstance.get('/api/customer/vehicles');
        // Expecting { success: true, data: Vehicle[] }
        const list = Array.isArray(response.data?.data) ? response.data.data : [];
        const mapped: CarDetails[] = list.map((v: any) => ({
          id: v.id?.toString?.() ?? `car-${Date.now()}`,
          brand: v.make,
          model: v.model,
          year: v.year,
          licensePlate: v.licensePlate,
          color: v.color,
          mileage: v.mileage ? String(v.mileage) : '',
          vinNumber: v.vinNumber ?? '',
        }));
        setCars(mapped);
      } catch (err: any) {
        setVehicleError(err?.response?.data?.message || err?.message || 'Failed to fetch vehicles');
      } finally {
        setVehicleLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Save cars to localStorage whenever it changes
  useEffect(() => {
    if (cars.length > 0) {
      localStorage.setItem('customerCars', JSON.stringify(cars));
    }
  }, [cars]);

  // Save appointments to localStorage whenever it changes
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem('customerAppointments', JSON.stringify(appointments));
    }
  }, [appointments]);

  const handleAddCar = (car: CarDetails) => {
    setCars([...cars, car]);
  };


  return (
    <>
      <div className=" min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Manage Your <span className="text-orange-500">Service Appointments</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Add your vehicle details and book appointments with our expert mechanics
            </p>
          </div>

          {/* Car Details Section */}
          <CarDetailsForm onAddCar={handleAddCar} existingCars={cars} />
          {vehicleLoading && (
            <div className="text-center text-gray-400 py-4">Loading vehicles...</div>
          )}
          {vehicleError && (
            <div className="text-center text-red-500 py-4">{vehicleError}</div>
          )}

          {/* Appointment Form Section */}
          <div className="mb-8">
            <AppointmentForm cars={cars} service={service} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceAppointments;