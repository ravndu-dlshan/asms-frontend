import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors gracefully
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Silently handle errors - don't log to console
    // The error will be caught and handled by the calling function
    return Promise.reject(error);
  }
);

export default axiosInstance;
