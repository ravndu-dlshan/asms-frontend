// timeLogService.js
// Helpers to call backend time-log endpoints

import axiosInstance from '@/app/lib/axios';

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:8080';

async function createTimeLog({ work_order_id, start_time, end_time, notes, employeeId }) {
	const url = `${BASE}/api/time-logs-new`;
	const body = { workOrderId: work_order_id, startTime: start_time, endTime: end_time, notes, employeeId };
	const res = await axiosInstance.post(url, body);
	// return created resource (support res.data.data or res.data)
	return res?.data?.data ?? res?.data;
}

async function getTimeLogsForWorkOrder(workOrderId, employeeId) {
	if (!workOrderId || !employeeId) {
		throw new Error('Both workOrderId and employeeId are required');
	}
	const url = `${BASE}/api/time-logs-new/work-order/${encodeURIComponent(workOrderId)}?employeeId=${encodeURIComponent(employeeId)}`;
	const res = await axiosInstance.get(url);
	return res?.data?.data ?? res?.data ?? [];
}

async function updateTimeLog(id, payload) {
	const url = `${BASE}/api/time-logs-new/${encodeURIComponent(id)}`;
	const res = await axiosInstance.put(url, payload);
	return res?.data?.data ?? res?.data;
}

async function deleteTimeLog(id, employeeId) {
	const url = `${BASE}/api/time-logs-new/${encodeURIComponent(id)}${employeeId ? `?employeeId=${encodeURIComponent(employeeId)}` : ''}`;
	const res = await axiosInstance.delete(url);
	return res?.data?.data ?? res?.data ?? null;
}

export { createTimeLog, getTimeLogsForWorkOrder, updateTimeLog, deleteTimeLog };

const timeLogService = {
	createTimeLog,
	getTimeLogsForWorkOrder,
	updateTimeLog,
	deleteTimeLog,
};

export default timeLogService;
