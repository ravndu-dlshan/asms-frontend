import axios from 'axios';
import { getCookie, setCookie, deleteCookie } from './cookies';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // allow sending cookies to the backend (useful when auth cookie is httpOnly and server expects credentials)
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get access token from cookie
    const token = getCookie('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {

        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getCookie('refreshToken');
      
      if (!refreshToken) {
        // No refresh token available, redirect to login
        console.log('No refresh token available, redirecting to login');
        deleteCookie('authToken');
        deleteCookie('refreshToken');
        deleteCookie('userRole');
        deleteCookie('userInfo');
        
        // Only redirect if we're in the browser
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        
        return Promise.reject(error);
      }

      try {
        // Request new access token using refresh token
        const response = await axios.post(
          `${BASE_URL}/api/auth/refresh-token`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { token: newAccessToken } = response.data;

        if (newAccessToken) {
          // Store new access token (1 hour expiry to match login)
          setCookie('authToken', newAccessToken, 3600);

          // Update authorization header
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Process queued requests
          processQueue(null, newAccessToken);

         
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
    
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError as Error, null);
        
        deleteCookie('authToken');
        deleteCookie('refreshToken');
        deleteCookie('userRole');
        deleteCookie('userInfo');
        
    
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
