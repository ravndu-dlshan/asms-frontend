import axiosInstance from "@/app/lib/axios";

interface WorkOrderType {
    vehicleId: number,
    type: string,
    title: string,
    description: string,
    estimatedCost: number,
}

const CreateAppointment = async (vehicleId: number, appointmentDate: string) => {
    try {
        const appointmentData = {
            vehicleId,
            appointmentDate,
        };
        await axiosInstance.post(`/api/customer/appointments`, appointmentData);

    } catch (error: any) {
        console.error("Failed to create appointment:", error.response?.data || error.message);
        throw error;
    }
};

const CreateWorkOrder = async (workOrder:WorkOrderType) => {
    try {
         await axiosInstance.post(`/api/customer/work-orders`, workOrder);

    } catch (error: any) {
        console.error("Failed to create appointment:", error.response?.data || error.message);
        throw error;
    }
};

export { CreateAppointment,CreateWorkOrder };
