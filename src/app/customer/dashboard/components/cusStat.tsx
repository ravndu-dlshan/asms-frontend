import React from "react";
import CountUp from "react-countup";

const stats = [
  { label: "Total Customers", value: 100 },
  { label: "Active Employees", value: 50 },
  { label: "Services Completed", value: 120 },
  { label: "Working Hours / Day", value: 12 },
];

const CusDashboardStat = () => {
  return (
    <div className="w-full text-white py-8 px-4 sm:px-8 md:px-16 lg:px-24 flex flex-wrap justify-center md:justify-between gap-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center w-36 sm:w-40 md:w-44 lg:w-48 text-center transition"
        >
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-white">
            <CountUp end={stat.value} duration={2} suffix="+" />
          </h2>
          <p className="mt-2 text-gray-400 font-medium text-sm sm:text-base md:text-base">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CusDashboardStat;
