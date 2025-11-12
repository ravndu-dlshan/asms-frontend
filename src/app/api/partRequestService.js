// partRequestService.js
// Helpers to call backend part-request endpoints

import axiosInstance from '@/app/lib/axios';

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:8080';

async function getPartRequests(employeeId) {
  const url = `${BASE}/api/employee/part-requests?employeeId=${encodeURIComponent(employeeId)}`;
  const res = await axiosInstance.get(url);
  return res?.data?.data ?? res?.data ?? [];
}

async function createPartRequest({ partName, vehicleModel, quantity, employeeId }) {
  const url = `${BASE}/api/employee/part-requests`;
  const body = { partName, vehicleModel, quantity, employeeId };
  const res = await axiosInstance.post(url, body);
  return res?.data?.data ?? res?.data;
}

async function updatePartRequestStatus(id, status) {
  const url = `${BASE}/api/employee/part-requests/${encodeURIComponent(id)}/status`;
  const body = { status };
  const res = await axiosInstance.put(url, body);
  return res?.data?.data ?? res?.data;
}

const partRequestService = {
  getPartRequests,
  createPartRequest,
  updatePartRequestStatus,
};

export { getPartRequests, createPartRequest, updatePartRequestStatus };

export default partRequestService;