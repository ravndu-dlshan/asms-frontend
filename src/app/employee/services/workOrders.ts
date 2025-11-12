import axiosInstance from '../../lib/axios';

export interface WorkOrderSummary {
  totalToday: number;
  inProgressToday: number;
  completedToday: number;
  hoursLoggedToday?: number; // in minutes
}

export interface TimeLog {
  id: number;
  workOrderId: number;
  workOrderDescription: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  notes: string;
  loggedAt: string;
}

export interface TimeLogsResponse {
  success: boolean;
  message: string;
  data: TimeLog[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: WorkOrderSummary;
}

// Fetch work order summary
export const getWorkOrderSummary = async (): Promise<WorkOrderSummary> => {
  try {
    const response = await axiosInstance.get<ApiResponse>('/api/work-orders/my-assigned/summary');
    if (response.data.success) {
      return response.data.data;
    }
    return { totalToday: 0, inProgressToday: 0, completedToday: 0 };
  } catch (error) {
    console.error('Error fetching work order summary:', error);
    return { totalToday: 0, inProgressToday: 0, completedToday: 0 };
  }
};

// Fetch total hours logged today
export const getHoursLoggedToday = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get<{ success: boolean; message: string; data: number }>('/api/time-logs/today/hours');
    if (response.data.success) {
      // Convert hours to minutes for consistency with WorkOrderSummary
      return response.data.data * 60;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching hours logged today:', error);
    return 0;
  }
};

// Combine summary and total hours logged
export const getCompleteWorkOrderSummary = async (): Promise<WorkOrderSummary> => {
  try {
    const [summary, totalMinutes] = await Promise.all([
      getWorkOrderSummary(),
      getHoursLoggedToday(),
    ]);

    return {
      ...summary,
      hoursLoggedToday: totalMinutes,
    };
  } catch (error) {
    console.error('Error fetching complete work order summary:', error);
    return { totalToday: 0, inProgressToday: 0, completedToday: 0, hoursLoggedToday: 0 };
  }
};
