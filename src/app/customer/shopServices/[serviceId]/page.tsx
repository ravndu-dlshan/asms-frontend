'use client';
import { useParams } from 'next/navigation';
import ServiceCard from '../components/serviceCard';

interface ServiceCardRecord {
    title: string;
    description: string;
    image: string;
}

const vehicleRepairRecords: ServiceCardRecord[] = [
    {
        title: "Periodical Maintenance",
        description:
            "Proper maintenance on a regular basis is essential to keep your vehicle functioning efficiently. Our periodical maintenance service includes engine oil changes, filter replacements, brake inspections, and comprehensive check-ups to ensure optimal performance and prevent unexpected breakdowns.",
        image: "/services/vrepair1.jpg"
    },
    {
        title: "Mechanical Repair",
        description:
            "Our skilled technicians perform mechanical repairs with precision and care. Whether it's engine overhauls, transmission issues, suspension work, or clutch replacements, we combine technical expertise, modern tools, and years of experience to restore your vehicle's mechanical systems to perfect working order.",
        image: "/services/vrepair2.jpg"
    },
    {
        title: "High Voltage System",
        description:
            "With growing adoption of hybrid and electric vehicles, our experts specialize in diagnosing and repairing high voltage systems. We handle battery management systems, inverters, and electric drivetrains safely and efficiently, ensuring your EV runs smoothly and reliably.",
        image: "/services/vrepair3.jpg"
    },
    {
        title: "Electrical & Electronic",
        description:
            "Our team is equipped to troubleshoot and repair complex automotive electrical and electronic systems. From alternators and starters to sensors, wiring harnesses, and ECU programming, we use advanced diagnostic tools to identify and fix issues accurately.",
        image: "/services/vrepair4.jpg"
    },
    {
        title: "A/C Repair and Service",
        description:
            "We provide complete air conditioning repair and maintenance services to keep your cabin comfortable. From refrigerant recharging and compressor replacement to leak detection and performance testing, we ensure your A/C system works efficiently all year round.",
        image: "/services/vrepair5.jpg"
    },
    {
        title: "Multipoint Inspection Report",
        description:
            "Our multipoint inspection report provides a thorough assessment of your vehicle's condition. Covering over 140 key checkpoints — including brakes, suspension, fluids, and electronics — this service helps identify potential issues early and ensures your vehicle remains safe and reliable.",
        image: "/services/vrepair6.jpg"
    }
];

const vehicleServiceRecords: ServiceCardRecord[] = [
    {
        title: "Periodic Maintenance",
        description: "Our periodic maintenance covers the full service of your vehicle by touching more than 40 points in comprehensive inspection and servicing",
        image: "/services/vservice1.jpg"
    },
    {
        title: "Lubricant Service",
        description: "Engine is one of the key element of a vehicle and it is important to ensure that the moving parts are properly lubricated for optimal performance",
        image: "/services/vservice2.jpg"
    },
    {
        title: "Wash & Detail",
        description: "Maintain the vehicle in a clean and good environment will enhance the lifetime of vehicle body and interior components",
        image: "/services/vservice3.jpg"
    }
];

const collisionRepairRecords: ServiceCardRecord[] = [
    {
        title: "General Collision Repair",
        description: "We rebuild your vehicle to the original condition with the cutting edge technology we used in our state-of-the-art facility",
        image: "/services/vcollision1.jpg"
    },
    {
        title: "Quick Collision Repair",
        description: "We rebuild your vehicle to the original condition with the cutting edge technology we used in our efficient quick repair process",
        image: "/services/vcollision2.jpg"
    },
    {
        title: "Complete Paint",
        description: "We rebuild your vehicle to the original condition with the cutting edge technology we used in our professional paint shop",
        image: "/services/vcollision3.jpg"
    }
];
const autoDetailingRecords: ServiceCardRecord[] = [
    {
        title: "Exterior Detailing",
        description: "Experience our exterior detailing to make sure the long lasting shining and elegance to your vehicle with professional care and premium products",
        image: "/services/detailing1.jpg"
    },
    {
        title: "Interior Detailing",
        description: "Your vehicle interior will be so great; you wish you could remain inside for longer, come and feel the comfort of a professionally detailed cabin",
        image: "/services/detailing2.jpg"
    }
];

const ShopServicePage = () => {
    const params = useParams(); // gives { serviceId: 'vehicleRepair' }
    const serviceId = params.serviceId;

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


    return <ServiceCard services={services} title={title} description={description} />;
};

export default ShopServicePage;