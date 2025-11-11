import React, { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/app/lib/axios";

export interface WorkOrder {
  title: string;
  type: string;
  status: string;
  progressPercentage: number;
}

const CustomerDashboardHero = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchWorkOrders = async () => {
      try {
        const res = await axiosInstance.get("/api/customer/work-orders/my");
        console.log("work orders response:", res.data);

        const list = Array.isArray(res.data?.data) ? res.data.data : [];

        const mapped: WorkOrder[] = list.map((a: any) => ({
          id: a.id,
          title: a.title,
          type: a.type,
          status: a.status,
          progressPercentage: a.progressPercentage,
          vehicleDetails: a.vehicleDetails,
          customerName: a.customerName,
        }));

        setWorkOrders(mapped);
      } catch (error) {
        console.error("Error fetching work orders:", error);
      }
    };

    fetchWorkOrders();

    // Poll every 10 seconds
    intervalId = setInterval(fetchWorkOrders, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "UNASSIGNED":
        return "bg-gray-500";
      case "IN_PROGRESS":
        return "bg-orange-500";
      case "COMPLETED":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  // Show recommendations only when workOrders array is empty
  const showRecommendations = workOrders.length === 0;

  return (
    <div className="relative min-h-screen bg-[#0d0d0d] text-white overflow-hidden flex flex-col justify-between">
      <div className="absolute top-1/3 right-1/4 w-96 h-0 bg-orange-600 rounded-full blur-[150px] opacity-10"></div>

      <div className="absolute inset-0 md:inset-50 flex justify-start items-center">
        <img
          src="/suvCar.png"
          alt="Car Background"
          className="w-[650px] lg:w-[750px] opacity-35 lg:opacity-70 object-contain lg:ml-20 select-none pointer-events-none"
        />
      </div>

      <div className="relative z-10 container mx-auto px-8 py-20 flex flex-col lg:flex-row items-start justify-between">
        {/* Left Side */}
        <div className="flex-1 space-y-6 max-w-lg">
          <h1 className="text-5xl font-extrabold uppercase leading-tight">
          BOOK YOUR CUSTOM <br />
            <span className="text-orange-500">CAR PROJECT</span>
          </h1>
          <p className="text-gray-400 text-base max-w-md">
          Bring your ideas — we’ll handle the rest. From concept to completion, get your car modified by skilled experts with precision and style.
          </p>
          <Link href="/customer/customerAppoinments/">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-md font-semibold uppercase tracking-wide transition-all duration-300">
            START YOUR BUILD
            </button>
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex-1 w-full md:max-w-sm space-y-6 mt-10 lg:mt-0 min-h-[420px] flex flex-col">
          {showRecommendations && (
            <h2 className="text-2xl font-bold text-orange-500 uppercase">
              Recommendations
            </h2>
          )}

          <div
            className="max-h-[420px] flex-1 overflow-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#585858 #0d0d0d" }}
          >
            {showRecommendations ? (
              <>
                <div className="p-3 border border-gray-700 rounded-md hover:border-orange-500 transition">
                  <h3 className="font-semibold text-white mb-1">01. Interim Service</h3>
                  <p className="text-gray-400 text-sm">
                    Every 6 months or 6,000 miles (whichever comes first)
                  </p>
                </div>

                <div className="p-3 border border-gray-700 rounded-md hover:border-orange-500 transition">
                  <h3 className="font-semibold text-white mb-1">02. Full Service</h3>
                  <p className="text-gray-400 text-sm">
                    Every 12 months or 12,000 miles (whichever comes first)
                  </p>
                </div>

                <div className="p-3 border border-gray-700 rounded-md hover:border-orange-500 transition">
                  <h3 className="font-semibold text-white mb-1">03. Brake Inspection</h3>
                  <p className="text-gray-400 text-sm">
                    Recommended every 10,000 miles to ensure safe braking performance
                  </p>
                </div>

                <div className="p-3 border border-gray-700 rounded-md hover:border-orange-500 transition">
                  <h3 className="font-semibold text-white mb-1">04. Tire Rotation</h3>
                  <p className="text-gray-400 text-sm">
                    Rotate tires every 8,000 miles for even tread wear
                  </p>
                </div>
              </>
            ) : (
              workOrders.map((order, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-700 rounded-md hover:border-orange-500 transition-all duration-500"
                >
                  <h3 className="font-semibold text-white mb-1">
                    {String(index + 1).padStart(2, "0")}.{" "}
                    {order.type === "SERVICE" ? "Service" : "Project"}
                  </h3>

                  <p className="text-gray-400 text-sm mb-3">
                    Status:{" "}
                    <span className="text-white font-medium">
                      {order.status.replace("_", " ")}
                    </span>
                  </p>

                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`${getStatusColor(order.status)} h-2 transition-all duration-700`}
                      style={{ width: `${order.progressPercentage}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{order.progressPercentage}%</span>
                    <span>{order.status.replace("_", " ")}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom logo bar */}
      <div className="relative z-10 border-t border-gray-800 py-6">
        <div className="flex flex-wrap justify-center items-center gap-8">
          {[
            { name: "TOYOTA", src: "./logos/toyota.png" },
            { name: "HONDA", src: "/logos/honda.png" },
            { name: "BMW", src: "/logos/bmw.png" },
            { name: "MERCEDES", src: "/logos/mercedes.png" },
            { name: "SUZUKI", src: "/logos/suzuki.png" },
          ].map((brand, index) => (
            <div
              key={index}
              className="md:w-[15%] w-32 border border-gray-700 p-3 rounded-md flex items-center justify-center hover:border-orange-500 transition"
            >
              <img src={brand.src} alt={brand.name} className="h-8 lg:h-18 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardHero;
