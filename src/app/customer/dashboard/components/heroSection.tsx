import React from "react";
import Link from "next/link";

const CustomerDashboardHero = () => {
    return (
        <div className="relative min-h-screen bg-[#0d0d0d] text-white overflow-hidden flex flex-col justify-between">
            {/* Background glow */}
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-[150px] opacity-10"></div>

            {/* Car background image */}
            <div className="absolute inset-0 md:inset-50 flex justify-start items-center">
                <img
                    src="./suvCar.png"
                    alt="Car Background"
                    className="w-[650px] lg:w-[750px] opacity-35 lg:opacity-70 object-contain lg:ml-20 select-none pointer-events-none"
                />
            </div>


            {/* Main content container */}
            <div className="relative z-10 container mx-auto px-8 py-20 flex flex-col lg:flex-row items-center justify-between">
                {/* Left side content */}
                <div className="flex-1 space-y-6 max-w-lg">
                    <h1 className="text-5xl font-extrabold uppercase leading-tight">
                        Book Your Car <br />
                        <span className="text-orange-500">Service</span>
                    </h1>
                    <p className="text-gray-400 text-base max-w-md">
                        Get your car service done from trusted and skilled professionals.
                        Experience the best quality and performance every time.
                    </p>
                    <Link href="/customer/Customer_Appoinments">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-md font-semibold uppercase tracking-wide transition-all duration-300">
                            Book Online
                        </button>
                    </Link>
                </div>

                {/* Recommendations */}
                <div className="flex-1 max-w-sm space-y-6 mt-10 lg:mt-0">
                    <h2 className="text-2xl font-bold text-orange-500 uppercase">
                        Recommendations
                    </h2>

                    <div className="space-y-4">
                        <div className="p-4 border border-gray-700 rounded-md hover:border-orange-500 transition">
                            <h3 className="font-semibold text-white mb-1">
                                01. Interim Service
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Every 6 months or 6,000 miles (whichever comes first)
                            </p>
                        </div>

                        <div className="p-4 border border-gray-700 rounded-md hover:border-orange-500 transition">
                            <h3 className="font-semibold text-white mb-1">02. Full Service</h3>
                            <p className="text-gray-400 text-sm">
                                Every 12 months or 12,000 miles (whichever comes first)
                            </p>
                        </div>
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
                            <img
                                src={brand.src}
                                alt={brand.name}
                                className="h-8 lg:h-18 object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default CustomerDashboardHero;
