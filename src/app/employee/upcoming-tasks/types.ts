export interface Task {
  id: string;
  title: string;
  vehicleModel: string;
  customerName: string;
  location: string;
  scheduledTime: string;
  estimatedDuration?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent' | string;
  status?: 'scheduled' | 'in-progress' | 'completed' | 'rescheduled' | string;
  description?: string;
  customerPhone?: string;
  customerEmail?: string;
  requiredParts?: string[];
  specialInstructions?: string;
  // Backend additional fields
  estimatedCost?: number | null;
  statusMessage?: string | null;
  assignedEmployeeName?: string | null;
  assignedEmployeeId?: number | null;
  appointmentId?: number | null;
  vehicleId?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
