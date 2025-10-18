'use client';

import { DollarSign, TrendingUp, Clock, Download, Eye } from 'lucide-react';

interface SalarySummaryProps {
  totalHours: number;
  estimatedPay: number;
  bonus: number;
  efficiency: number;
}

export default function SalarySummary({ totalHours, estimatedPay, bonus, efficiency }: SalarySummaryProps) {
  const overtimeHours = Math.max(0, totalHours - 40);
  const regularHours = totalHours - overtimeHours;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white">Salary Summary</h3>
          <span className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
            This Week
          </span>
        </div>
        <p className="text-gray-400 text-sm">Your earnings overview and performance metrics</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Estimated Pay</p>
                <p className="text-xs text-gray-500">+${bonus} bonus</p>
              </div>
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-1">
            ${(estimatedPay + bonus).toLocaleString()}
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">+12% from last week</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Hours Breakdown
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400 font-semibold uppercase">Total Hours</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalHours.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400 font-semibold uppercase">Avg Hours/Job</span>
              </div>
              <p className="text-2xl font-bold text-white">3.2</p>
              <p className="text-xs text-gray-500 mt-1">Efficiency: {efficiency}%</p>
            </div>
          </div>
        </div>

        {overtimeHours > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">Overtime Hours</p>
                <p className="text-2xl font-bold text-orange-400">{overtimeHours.toFixed(1)} hrs</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 font-medium mb-1">Overtime Pay</p>
                <p className="text-2xl font-bold text-orange-400">
                  ${(overtimeHours * 15).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Performance Metrics
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Efficiency Rate</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                    style={{ width: `${efficiency}%` }}
                  ></div>
                </div>
                <span className="text-white font-semibold text-sm w-12 text-right">
                  {efficiency}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Regular Hours</span>
              <span className="text-white font-semibold">{regularHours.toFixed(1)} hrs</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Completed Jobs</span>
              <span className="text-white font-semibold">13 jobs</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800 flex items-center space-x-3">
          <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg shadow-orange-500/20">
            <Download className="w-4 h-4" />
            <span>Download Payslip</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium border border-gray-700">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}