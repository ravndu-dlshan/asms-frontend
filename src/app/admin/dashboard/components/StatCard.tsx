"use client";

import React from "react";
import { Users, Briefcase, CheckCircle, Clock, DollarSign } from "lucide-react";

interface StatCardData {
  title: string;
  value: number | string;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subtitle?: string;
}

interface StatCardProps {
  loading?: boolean;
  stats?: StatCardData[];
}

const DEFAULT_STATS: StatCardData[] = [
  {
    title: "Total Employees",
    value: 0,
    change: "+0%",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    subtitle: "Active staff",
  },
  {
    title: "Active Work Orders",
    value: 0,
    change: "+0%",
    icon: Briefcase,
    color: "from-orange-500 to-orange-600",
    subtitle: "In progress",
  },
  {
    title: "Completed Today",
    value: 0,
    change: "+0%",
    icon: CheckCircle,
    color: "from-green-500 to-green-600",
    subtitle: "Finished tasks",
  },
  {
    title: "Pending Appointments",
    value: 0,
    change: "+0%",
    icon: Clock,
    color: "from-purple-500 to-purple-600",
    subtitle: "Upcoming",
  },
];

export default function StatCard({ loading, stats = DEFAULT_STATS }: StatCardProps) {
  const colsClass =
    stats.length === 3
      ? "lg:grid-cols-3"
      : stats.length === 2
      ? "lg:grid-cols-2"
      : "lg:grid-cols-4";
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${colsClass} gap-4 mb-6`}>
      {stats.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="relative flex flex-col justify-between p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-orange-500/30 transition-all group"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {loading ? "-" : card.value}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                )}
              </div>
              {Icon && (
                <div
                  className={`bg-gradient-to-br ${card.color} p-3 rounded-lg flex items-center justify-center shadow-lg shadow-${card.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            
            {card.change && (
              <div className="flex items-center text-xs text-gray-400">
                <span className={card.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                  {card.change}
                </span>
                <span className="ml-2">from last month</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

