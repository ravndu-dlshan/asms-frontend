'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import FooterSection from '../components/footer';
import ChatBot from '../components/ChatBot';
import CarDetailsForm from './components/CarDetailsForm';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import type { CarDetails, Appointment } from './types';

export default function CustomerAppointments() {
  const [cars, setCars] = useState<CarDetails[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCars = localStorage.getItem('customerCars');
    const savedAppointments = localStorage.getItem('customerAppointments');

    if (savedCars) {
      setCars(JSON.parse(savedCars));
    }

    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
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

  const handleBookAppointment = (appointmentData: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setAppointments([...appointments, newAppointment]);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
    ));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Manage Your <span className="text-orange-500">Appointments</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Add your vehicle details and book appointments with our expert mechanics
            </p>
          </div>

          {/* Car Details Section */}
          <CarDetailsForm onAddCar={handleAddCar} existingCars={cars} />

          {/* Appointment Form Section */}
          <div className="mb-8">
            <AppointmentForm cars={cars} onBookAppointment={handleBookAppointment} />
          </div>

          {/* Appointments List Section */}
          <AppointmentList 
            appointments={appointments} 
            onCancelAppointment={handleCancelAppointment}
          />
        </div>
      </div>
      <FooterSection />
      <ChatBot />
    </>
  );
}

