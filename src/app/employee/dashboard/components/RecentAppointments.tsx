import React from "react";
import { Calendar } from "lucide-react";

export default function RecentAppointments() {
  // appointment type
  interface Appointment {
    id: number;
    client: string;
    date: string;
    time: string;
    service: string;
  }

  // Fetch appointments from backend
  /*
  import { useEffect, useState } from 'react';

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetch('http://localhost:5173/api/appointments')
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error('Error fetching appointments:', err));
  }, []);
  */

  // Placeholder for now (no backend connected)
  const appointments: Appointment[] = [];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Upcoming Appointments</h2>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 && (
          <p className="text-gray-400 text-sm text-center">
            No upcoming appointments available.
          </p>
        )}

        {/* Map through appointments */}
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-gray-700 hover:bg-gray-650 rounded-xl p-4 transition border border-gray-600 hover:border-gray-500"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  <Calendar />
                </span>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{apt.client}</p>
                <p className="text-gray-400 text-xs">{apt.date}</p>
                <p className="text-gray-300 text-xs italic">{apt.service}</p>
              </div>
            </div>
            <p className="text-orange-400 font-semibold text-sm mt-3">
              {apt.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
