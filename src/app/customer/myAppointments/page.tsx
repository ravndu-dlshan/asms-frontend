'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import FooterSection from '../components/footer';
import ChatBot from '../components/ChatBot';
import AppointmentList from './components/AppointmentList';
import type { Appointment } from './types';

export default function CustomerAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
    ));
  };

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My <span className="text-orange-500">Appointments</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Manage all your vehicle service bookings in one place. Schedule, view, and track your appointments with our trusted mechanics effortlessly.
            </p>
          </div>

          {/* Appointments List Section */}
          <AppointmentList
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
          />
        </div>
      </div>
    </>
  );
}

