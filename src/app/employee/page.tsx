// src/app/employee/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Award,
  ArrowRight,
  Bell,
  Activity,
  Target,
  Zap
} from 'lucide-react';

export default function EmployeeDashboard() {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  

 

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      urgent: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[priority] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      scheduled: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'in-progress': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {greeting}, John! 👋
            </h1>
            <p className="text-gray-400 text-lg">
              You have <span className="text-orange-400 font-semibold">5 tasks</span> scheduled for today
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-gray-400 text-sm">Current Time</p>
              <p className="text-white text-xl font-bold">
                {currentDate.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Activity className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
      

  );
}