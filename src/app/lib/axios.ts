import axios from 'axios';
import { getCookie } from './cookies';

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
    // Get token from both localStorage and cookies (cookies first, then localStorage as fallback)
    let token = getCookie('authToken');
    
    // Fallback to localStorage if cookie is not available
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug log to verify token is being added
      console.log('🔑 Token attached to request:', config.url, 'Token exists:', !!token);
    } else {
      console.warn('⚠️ No auth token found for request:', config.url);
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
