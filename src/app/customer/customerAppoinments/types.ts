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

