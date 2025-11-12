export interface CarDetails {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  mileage?: string;
  vinNumber?: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  estimatedDuration: string;
  estimatedCost: number;
}

export interface Appointment {
  id: string;
  carId: string;
  carDetails: CarDetails;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost?: number;
  createdAt: string;
}

export interface ServiceRecord {
  id: string;
  appointmentId: string;
  carId: string;
  date: string;
  servicesPerformed: ServiceOption[];
  partsUsed?: string[];
  technician?: string;
  notes?: string;
  totalCost?: number;
  status?: 'in-progress' | 'completed';
}

export interface CarDetails {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  mileage?: string;
  vinNumber?: string;
}

export interface Appointment {
  id: string;
  carId: string;
  carDetails: CarDetails;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost?: number;
  createdAt: string;
}

 export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  estimatedDuration: string;
  estimatedCost: number;
}

export interface ServiceRecord {
  id:number;
  title: string;
  description: string;
  image: string;
  price: string;
  estimatedTime: string;
}