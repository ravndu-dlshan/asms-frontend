'use client';
import React from 'react';

interface ServiceCardType {
  title: string;
  description: string;
  image: string;
}

interface ServiceCardProps {
  services?: ServiceCardType[]; // optional
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ services = [], title, description }) => {
  return (
    <section className="py-16 px-4 min-h-screen bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">{title}</h2>
        <p className="text-gray-400 max-w-md mx-auto">{description}</p>
        <div className="flex items-center justify-center mt-4">
          <div className="h-0.5 bg-orange-500 w-10"></div>
          <div className="w-4 h-4 rounded-full border-2 border-orange-500"></div>
          <div className="h-0.5 bg-orange-500 w-10"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 border border-gray-800"
          >
            <div className="h-48 bg-gray-900 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-3 border-b-2 border-orange-500 pb-2 inline-block">
                {service.title}
              </h3>

              <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-6">
                {service.description}
              </p>

              <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded transition-colors duration-300 shadow-lg hover:shadow-orange-600/50">
                Read more
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceCard;