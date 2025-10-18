'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { day: 'Mon', hoursWorked: 8, targetHours: 8 },
  { day: 'Tue', hoursWorked: 7, targetHours: 8 },
  { day: 'Wed', hoursWorked: 9, targetHours: 8 },
  { day: 'Thu', hoursWorked: 9, targetHours: 8 },
  { day: 'Fri', hoursWorked: 8, targetHours: 8 },
  { day: 'Sat', hoursWorked: 4, targetHours: 4 },
  { day: 'Sun', hoursWorked: 0, targetHours: 0 }
];

export default function PerformanceChart() {
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { day: string; hoursWorked: number; targetHours: number }; value?: number }>; }) => {
    if (active && payload && payload.length) {
      const first = payload[0];
      const second = payload[1];
      const day = first.payload.day;
      const hoursWorkedVal = first.value ?? first.payload.hoursWorked;
      const targetHoursVal = second ? (second.value ?? second.payload.targetHours) : undefined;

      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-2">{day}</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-400">
              Hours Worked: <span className="font-semibold">{hoursWorkedVal}h</span>
            </p>
            <p className="text-sm text-orange-400">
              Target Hours: <span className="font-semibold">{targetHoursVal ?? '-'}h</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Weekly Work Trends</h3>
            <p className="text-gray-400 text-sm">Track your daily performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-400">Hours Worked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm text-gray-400">Target Hours</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="day" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="hoursWorked" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              type="monotone" 
              dataKey="targetHours" 
              stroke="#F97316" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-gray-800">
        <div className="text-center">
          <p className="text-2xl font-bold text-white mb-1">45</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total Hours</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400 mb-1">106%</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Efficiency</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-400 mb-1">5</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Overtime Hrs</p>
        </div>
      </div>
    </div>
  );
}
