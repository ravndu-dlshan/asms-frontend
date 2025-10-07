import React, { useState, useRef } from 'react';

interface ServiceCardData {
  id: string;
  title: string;
  description: string;
  backgroundImage?: string;
  hasReadMore?: boolean;
}

interface ServiceCardProps {
  card: ServiceCardData;
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ card, className = '' }) => {
  const { title, description, backgroundImage, hasReadMore } = card;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden w-[280px] h-[470px] group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${className}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: backgroundImage ? 'transparent' : '#1e3a8a'
      }}
    >
      {/* Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6">
        {/* Centered Button */}
        {hasReadMore && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="bg-orange-500 text-white px-6 py-2 rounded-4xl text-sm md:text-base font-medium duration-200 shadow-lg transition-all transform hover:scale-105">
              READ MORE
            </button>
          </div>
        )}

        {/* Title & Description at Bottom */}
        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/70 to-transparent">
          <h3 className="text-white font-semibold text-lg md:text-xl mb-2">{title}</h3>
          <p className="text-white/90 text-sm md:text-base leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

const ServiceSection: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const services: ServiceCardData[] = [
    {
      id: 'maintenance',
      title: 'Maintenance Service',
      description: 'Regular maintenance to keep your vehicle running smoothly and efficiently.',
      backgroundImage: './services/service1.jpg',
      hasReadMore: true
    },
    {
      id: 'diagnostic',
      title: 'Diagnostic Service',
      description: 'Comprehensive vehicle diagnostics to identify and fix issues early.',
      backgroundImage: './services/service2.jpg',
      hasReadMore: true
    },
    {
      id: 'oil-change',
      title: 'Oil Change',
      description: 'Quick and professional oil changes to extend your engine life.',
      backgroundImage: './services/service3.jpg',
      hasReadMore: true
    },
    {
      id: 'tire-service',
      title: 'Tire Service',
      description: 'Tire inspection, rotation, and replacement to ensure safety on the road.',
      backgroundImage: './services/service4.jpg',
      hasReadMore: true
    }
  ];

  const handleStart = (clientX: number) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(clientX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !sliderRef.current) return;
    const x = clientX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (!sliderRef.current) return;

    const cardWidth = 280; // width + gap
    const newIndex = Math.round(sliderRef.current.scrollLeft / cardWidth);

    sliderRef.current.scrollTo({
      left: newIndex * cardWidth,
      behavior: 'smooth'
    });
  };

  return (
    <div className="  py-12 px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">
          OUR SERVICES
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Professional and reliable automotive services to keep your car in top condition.
        </p>
        <div className="flex items-center justify-center mt-4">
          <div className="h-0.5 bg-orange-500 w-10"></div>
          <div className="w-4 h-4 rounded-full border-2 border-orange-500  "></div>
          <div className="h-0.5 bg-orange-500 w-10"></div>
        </div>
      </div>

      {/* Desktop cards */}
      <div className="hidden md:flex md:justify-center md:gap-6 mb-8 overflow-x-visible">
        {services.map((service) => (
          <ServiceCard key={service.id} card={service} className="flex-shrink-0 w-72" />
        ))}
      </div>

      {/* Mobile Slider */}
      <div className="md:hidden mb-8">
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing px-4"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={(e) => handleStart(e.pageX)}
          onMouseMove={(e) => handleMove(e.pageX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
        >
          {services.map((service) => (
            <ServiceCard key={service.id} card={service} className="flex-shrink-0 w-64 scroll-snap-align-start" />
          ))}
        </div>
      </div>

      {/* More Info Button */}
      <div className="text-center">
        <button className="border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105">
          MORE INFO
        </button>
      </div>
    </div>
  );
};

export default ServiceSection;
