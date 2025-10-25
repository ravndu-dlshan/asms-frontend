"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, CheckCircle, Calendar, DollarSign } from "lucide-react";

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
        title: "Total Jobs",
        value: 0,
        change: "0%",
        icon: Briefcase,
        color: "from-blue-500 to-blue-600",
      },
      {
        title: "Completed",
        value: 0,
        change: "0%",
        icon: CheckCircle,
        color: "from-green-500 to-green-600",
      },
      {
        title: "Pending Jobs",
        value: 0,
        change: "0%",
        icon: Calendar,
        color: "from-orange-500 to-orange-600",
      },
      {
        title: "Hours Logged",
        value: 0,
        change: "0%",
        icon: DollarSign,
        color: "from-purple-500 to-purple-600",
      },
    ]);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-2 grid grid-cols-2 grid-rows-2 gap-2 mt-5 relative overflow-hidden">
      {/* Subtle orange gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5 pointer-events-none" />
      
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="relative flex flex-col justify-between p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-transparent border border-gray-700/30"
          >
            {/* Top orange accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
            
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-white">
                  {loading ? "-" : card.value}
                </p>
              </div>
              {Icon && (
                <div
                  className={`bg-gradient-to-br ${card.color} p-2 rounded-lg flex items-center justify-center shadow-lg shadow-${card.color.split('-')[1]}-500/20`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            
            {/* Bottom orange accent line */}
            <div className="relative">
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent mb-6" />
              <div className="text-gray-500 text-sm">for Today</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}