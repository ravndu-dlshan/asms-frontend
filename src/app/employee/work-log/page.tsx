'use client';

import { DollarSign, Clock, TrendingUp, Award } from 'lucide-react';
import WorkLogTable from './components/WorkLogTable';
import TimeTracker from './components/TimeTracker';
import {} from './components/SalarySummary';
import SalarySummary from './components/SalarySummary';
import PerformanceChart from './components/PerformanceChart';

export default function WorkLogPage() {
  const workLogs = [
    {
      id: '#SV-2024-001',
      serviceType: 'Oil Change',
      date: '2024-10-15',
      hours: 2.5,
      basePay: 75,
      overtime: 0,
      bonus: 10,
      finalPay: 85
    },
    {
      id: '#SV-2024-002',
      serviceType: 'Brake Service',
      date: '2024-10-15',
      hours: 4.0,
      basePay: 120,
      overtime: 15,
      bonus: 20,
      finalPay: 155
    },
    {
      id: '#SV-2024-003',
      serviceType: 'Engine Diagnostic',
      date: '2024-10-14',
      hours: 3.5,
      basePay: 105,
      overtime: 0,
      bonus: 0,
      finalPay: 105
    },
    {
      id: '#SV-2024-004',
      serviceType: 'Tire Rotation',
      date: '2024-10-14',
      hours: 1.0,
      basePay: 30,
      overtime: 0,
      bonus: 0,
      finalPay: 30
    },
    {
      id: '#SV-2024-005',
      serviceType: 'AC Recharge',
      date: '2024-10-13',
      hours: 1.5,
      basePay: 45,
      overtime: 0,
      bonus: 5,
      finalPay: 50
    },
    {
      id: '#SV-2024-006',
      serviceType: 'Battery Replacement',
      date: '2024-10-13',
      hours: 0.5,
      basePay: 15,
      overtime: 0,
      bonus: 0,
      finalPay: 15
    },
    {
      id: '#SV-2024-007',
      serviceType: 'Transmission Service',
      date: '2024-10-12',
      hours: 5.0,
      basePay: 150,
      overtime: 30,
      bonus: 25,
      finalPay: 205
    },
    {
      id: '#SV-2024-008',
      serviceType: 'Wheel Alignment',
      date: '2024-10-12',
      hours: 1.5,
      basePay: 45,
      overtime: 0,
      bonus: 0,
      finalPay: 45
    }
  ];

  const totalHours = workLogs.reduce((sum, log) => sum + log.hours, 0);
  const totalBasePay = workLogs.reduce((sum, log) => sum + log.basePay, 0);
  const totalBonus = workLogs.reduce((sum, log) => sum + log.bonus, 0);
  const totalOvertime = workLogs.reduce((sum, log) => sum + log.overtime, 0);

  const stats = [
    {
      label: 'Total Hours (Week)',
      value: totalHours.toFixed(1),
      subtext: '+2.5 from last week',
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      trend: 'up'
    },
    {
      label: 'Avg Hours/Job',
      value: '3.2',
      subtext: 'Efficiency: 95%',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      trend: 'up'
    },
    {
      label: 'Estimated Pay',
      value: `${totalBasePay + totalBonus}`,
      subtext: `+${totalBonus} bonus`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-400',
      trend: 'up'
    },
    {
      label: 'Overtime Hours',
      value: (totalOvertime / 15).toFixed(1),
      subtext: '1.5x rate applied',
      icon: Award,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      trend: 'neutral'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Work Log & Time Tracking</h1>
        <p className="text-gray-400">Monitor your service hours and earnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                {stat.trend === 'up' && (
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <TimeTracker />
          <SalarySummary
            totalHours={totalHours}
            estimatedPay={totalBasePay}
            bonus={totalBonus}
            efficiency={95}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <PerformanceChart />
          <WorkLogTable logs={workLogs} />
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4">Company Offers & Incentives</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="text-green-400 font-bold mb-1">Service Champion</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Complete 20+ services this month for $200 bonus
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs text-green-400 font-semibold">15/20</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Progress: 75%</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-blue-400 font-bold mb-1">Efficiency Expert</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Maintain 90%+ efficiency for weekly $50 bonus
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-xs text-blue-400 font-semibold">95%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Current: 95% ✓</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h4 className="text-orange-400 font-bold mb-1">Quality First</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Zero rework jobs this week for $75 bonus
                </p>
                <p className="text-xs text-orange-400 font-semibold mt-3">Status: On track ✓</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}