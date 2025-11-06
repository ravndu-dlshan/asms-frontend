import axiosInstance from '../../lib/axios';

export interface WorkOrder {
  work_order_id: number;
  title: string;
  description: string;
  status: string;
  progress_percentage: number;
  status_message?: string;
  vehicleDetails: string;
  estimated_cost: number;
  actual_cost?: number;
  appointment_id: number;
  vehicle_id: number;
  customer_id: number;
  estimated_completion: string;
  actual_completion?: string;
  assigned_employee_id: number;
  type: string;
  created_at: string;
  updated_at: string;
}

// Backend response type
interface WorkOrderResponse {
  work_order_id: number;
  title: string;
  description: string;
  status: string;
  progressPercentage?: number;
  statusMessage?: string;
  vehicleDetails: string;
  estimated_cost: number;
  actual_cost?: number;
  appointment_id: number;
  vehicle_id: number;
  customer_id: number;
  estimated_completion: string;
  actual_completion?: string;
  assigned_employee_id: number;
  type: string;
  created_at: string;
  updated_at: string;
}

// Mapping function
const mapWorkOrder = (job: WorkOrderResponse): WorkOrder => ({
  work_order_id: job.work_order_id,
  title: job.title,
  description: job.description,
  status: job.status,
  progress_percentage: Number(job.progressPercentage || 0),
  status_message: job.statusMessage || "",
  vehicleDetails: job.vehicleDetails,
  estimated_cost: job.estimated_cost,
  actual_cost: job.actual_cost,
  appointment_id: job.appointment_id,
  vehicle_id: job.vehicle_id,
  customer_id: job.customer_id,
  estimated_completion: job.estimated_completion,
  actual_completion: job.actual_completion,
  assigned_employee_id: job.assigned_employee_id,
  type: job.type,
  created_at: job.created_at,
  updated_at: job.updated_at,
});

export const getAssignedWorkOrders = async (
  status?: string,
  filterToday = false,
  type?: string
): Promise<WorkOrder[]> => {
  try {
    const url = '/api/work-orders/my-assigned';
    const params: Record<string, string | boolean> = {};
    if (status) params.status = status;
    if (filterToday) params.filterToday = true;
    if (type) params.type = type;

    const response = await axiosInstance.get<{ success: boolean; data: WorkOrderResponse[] }>(
      url,
      { params }
    );

    if (!response.data.success) return [];
    return response.data.data.map(mapWorkOrder);
  } catch (error) {
    console.error('Error fetching assigned work orders:', error);
    return [];
  }
};