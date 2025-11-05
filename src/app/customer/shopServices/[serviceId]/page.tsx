'use client';
import { useParams } from 'next/navigation';
import ServiceCard from '../components/serviceCard';
import Navbar from '../../components/navbar';
import FooterSection from '../../components/footer';
import { useEffect, useState } from 'react';
import ServiceAppointments from '../../serviceAppointments/ServiceAppointments';

interface ServiceCardRecord {
    id: number;
    title: string;
    description: string;
    image: string;
    price: string;
    estimatedTime: string;
}

const vehicleRepairRecords: ServiceCardRecord[] = [
    {
        id: 1,
        title: "Periodical Maintenance",
        description:
            "Proper maintenance on a regular basis is essential to keep your vehicle functioning efficiently. Our periodical maintenance service includes engine oil changes, filter replacements, brake inspections, and comprehensive check-ups to ensure optimal performance and prevent unexpected breakdowns.",
        image: "/services/vrepair1.jpg",
        price: "LKR 12,000 – 18,000",
        estimatedTime: "3 – 5 hours"
    },
    {
        id: 2,
        title: "Mechanical Repair",
        description:
            "Our skilled technicians perform mechanical repairs with precision and care. Whether it's engine overhauls, transmission issues, suspension work, or clutch replacements, we combine technical expertise, modern tools, and years of experience to restore your vehicle's mechanical systems to perfect working order.",
        image: "/services/vrepair2.jpg",
        price: "LKR 15,000 – 45,000",
        estimatedTime: "1 – 3 days"
    },
    {
        id: 3,
        title: "High Voltage System",
        description:
            "With growing adoption of hybrid and electric vehicles, our experts specialize in diagnosing and repairing high voltage systems. We handle battery management systems, inverters, and electric drivetrains safely and efficiently, ensuring your EV runs smoothly and reliably.",
        image: "/services/vrepair3.jpg",
        price: "LKR 25,000 – 60,000",
        estimatedTime: "1 – 2 days"
    },
    {
        id: 4,
        title: "Electrical & Electronic",
        description:
            "Our team is equipped to troubleshoot and repair complex automotive electrical and electronic systems. From alternators and starters to sensors, wiring harnesses, and ECU programming, we use advanced diagnostic tools to identify and fix issues accurately.",
        image: "/services/vrepair4.jpg",
        price: "LKR 8,000 – 25,000",
        estimatedTime: "4 – 8 hours"
    },
    {
        id: 5,
        title: "A/C Repair and Service",
        description:
            "We provide complete air conditioning repair and maintenance services to keep your cabin comfortable. From refrigerant recharging and compressor replacement to leak detection and performance testing, we ensure your A/C system works efficiently all year round.",
        image: "/services/vrepair5.jpg",
        price: "LKR 6,000 – 18,000",
        estimatedTime: "3 – 6 hours"
    },
    {
        id: 6,
        title: "Multipoint Inspection Report",
        description:
            "Our multipoint inspection report provides a thorough assessment of your vehicle's condition. Covering over 140 key checkpoints — including brakes, suspension, fluids, and electronics — this service helps identify potential issues early and ensures your vehicle remains safe and reliable.",
        image: "/services/vrepair6.jpg",
        price: "LKR 4,000 – 7,000",
        estimatedTime: "2 – 3 hours"
    }
];

const vehicleServiceRecords: ServiceCardRecord[] = [
    {
        id: 7,
        title: "Periodic Maintenance",
        description: "Our periodic maintenance covers the full service of your vehicle by touching more than 40 points in comprehensive inspection and servicing",
        image: "/services/vservice1.jpg",
        price: "LKR 10,000 – 15,000",
        estimatedTime: "3 – 5 hours"
    },
    {
        id: 8,
        title: "Lubricant Service",
        description: "Engine is one of the key element of a vehicle and it is important to ensure that the moving parts are properly lubricated for optimal performance",
        image: "/services/vservice2.jpg",
        price: "LKR 5,000 – 9,000",
        estimatedTime: "1 – 2 hours"
    },
    {
        id: 9,
        title: "Wash & Detail",
        description: "Maintain the vehicle in a clean and good environment will enhance the lifetime of vehicle body and interior components",
        image: "/services/vservice3.jpg",
        price: "LKR 2,500 – 5,000",
        estimatedTime: "1 – 3 hours"
    }
];

const collisionRepairRecords: ServiceCardRecord[] = [
    {
        id: 10,
        title: "General Collision Repair",
        description: "We rebuild your vehicle to the original condition with the cutting edge technology we used in our state-of-the-art facility",
        image: "/services/vcollision1.jpg",
        price: "LKR 30,000 – 100,000",
        estimatedTime: "3 – 7 days"
    },
    {
        id: 11,
        title: "Quick Collision Repair",
        description: "We rebuild your vehicle to the original condition with the cutting edge technology we used in our efficient quick repair process",
        image: "/services/vcollision2.jpg",
        price: "LKR 15,000 – 40,000",
        estimatedTime: "1 – 3 days"
    },
    {
        id: 12,
        title: "Complete Paint",
        description: "We rebuild your vehicle to the original condition with the cutting edge technology we used in our professional paint shop",
        image: "/services/vcollision3.jpg",
        price: "LKR 25,000 – 80,000",
        estimatedTime: "2 – 5 days"
    }
];

const autoDetailingRecords: ServiceCardRecord[] = [
    {
        id: 13,
        title: "Exterior Detailing",
        description: "Experience our exterior detailing to make sure the long lasting shining and elegance to your vehicle with professional care and premium products",
        image: "/services/vdetailing1.jpg",
        price: "LKR 5,000 – 12,000",
        estimatedTime: "3 – 5 hours"
    },
    {
        id: 14,
        title: "Interior Detailing",
        description: "Your vehicle interior will be so great; you wish you could remain inside for longer, come and feel the comfort of a professionally detailed cabin",
        image: "/services/vdetailing2.jpg",
        price: "LKR 6,000 – 15,000",
        estimatedTime: "3 – 6 hours"
    }
];



const ShopServicePage = () => {
    const params = useParams(); // gives { serviceId: 'vehicleRepair' }
    const serviceId = params.serviceId;
    const [selectedService, setSelectedService] = useState<ServiceCardRecord | null>(null);

    useEffect(() => {
        console.log("Selected Service ID:", selectedService);
    }, [selectedService])

    let services: ServiceCardRecord[] = [];
    let title = '';
    let description = '';

    if (serviceId === 'vehicleRepair') {
        services = vehicleRepairRecords;
        title = 'Vehicle Repair';
        description = 'Expert mechanical repairs to keep your car running smoothly.';
    } else if (serviceId === 'vehicleService') {
        services = vehicleServiceRecords;
        title = 'Vehicle Service';
        description = 'Complete vehicle servicing to maintain peak performance.';
    } else if (serviceId === 'collisionRepair') {
        services = collisionRepairRecords;
        title = 'Collision Repair';
        description = 'Professional body repairs to restore your vehicle after accidents.';
    } else if (serviceId === 'autoDetailing') {
        services = autoDetailingRecords;
        title = 'Auto Detailing';
        description = 'Premium interior and exterior detailing for a spotless finish.';
    } else {
        return <p className="text-white text-center py-20">Service not found!</p>;
    }


    return (
        <>
            <Navbar />
            <ServiceCard services={services} title={title} description={description} setSelectedService={setSelectedService} />
            {selectedService && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5">
                    {/* Centered modal with max width */}
                    <div className="w-full max-w-6xl h-full bg-[#0d0d0d] flex flex-col overflow-hidden  rounded-lg">

                        {/* Header */}
                        <div className="flex justify-left items-center p-4">
                            <button
                                onClick={() => setSelectedService(null)}
                                className="text-red-400 hover:text-white text-4xl cursor-pointer"
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        <div
                            className="overflow-y-auto p-6 custom-scrollbar"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#585858 #0d0d0d'
                            }}
                        >
                            <ServiceAppointments service={selectedService} />
                        </div>

                    </div>
                </div>
            )}

            <FooterSection />

        </>
    );

};

export default ShopServicePage;