import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle, Calendar, DollarSign } from 'lucide-react';

interface StatCardData {
  title: string;
  value: number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface StatCardProps {
  loading?: boolean;
}

export default function StatCard({ loading }: StatCardProps) {
  const [statCards, setStatCards] = useState<StatCardData[]>([]);

  useEffect(() => {
    setStatCards([
      { 
        title: 'Total Jobs', 
        value: 0, 
        change: '0%',
        icon: Briefcase,
        color: 'from-blue-500 to-blue-600'
      },
      { 
        title: 'Completed Jobs', 
        value: 0, 
        change: '0%',
        icon: CheckCircle,
        color: 'from-green-500 to-green-600'
      },
      { 
        title: 'Pending Appointments', 
        value: 0, 
        change: '0%',
        icon: Calendar,
        color: 'from-orange-500 to-orange-600'
      },
      { 
        title: 'Hours Logged', 
        value: 0, 
        change: '0%',
        icon: DollarSign,
        color: 'from-purple-500 to-purple-600'
      },
    ]);
  }, []);

  return (
    <>
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition group">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-2">{card.title}</p>
                <p className="text-3xl font-bold text-white">{loading ? '-' : card.value}</p>
              </div>
              {Icon && (
                <div className={`bg-gradient-to-br ${card.color} p-3 rounded-xl group-hover:scale-110 transition`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">for Today</span>
            </div>
          </div>
        );
      })}
    </>
  );
}
