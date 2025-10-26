import axiosInstance from '@/app/lib/axios';
import axios from 'axios';

export const registerUser= async (userData: {email: string, firstName: string, lastName: string, password : string, role:string})=>{
    try{
        const response = await axiosInstance.post(`/api/auth/register`, userData);
        return response.data;
    }catch(error){
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Registration failed. Please try again.";
            throw new Error(errorMessage);
        }
        throw new Error("An unexpected error occurred during registration.");
    }
}


export const sendOtp = async (otpCode:string)=>{
    try{
        const response = await axiosInstance.post(`/api/auth/verify-otp`,  {otpCode} );
        return response.data;
    }catch(error){
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "OTP verification failed. Please try again.";
            throw new Error(errorMessage);
        }
        throw new Error("An unexpected error occurred during OTP verification.");
    }
}


export const loginUser = async (loginData: { email: string; password: string }) => {
  try {
    console.log("Login Data:", loginData);
    const response = await axiosInstance.post(`/api/auth/login`, loginData);

    const data = response.data;
    if (data?.token) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.role);
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Login failed. Please check your credentials.";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred during login.");
  }
};


export const forgotPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post(`/api/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to send reset email. Please try again.";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred while requesting password reset.");
  }
};


export const resetPassword = async (resetData: { email: string; otp: string; newPassword: string }) => {
  try {
    const response = await axiosInstance.post(`/api/auth/reset-password`, resetData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to reset password. Please try again.";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred while resetting password.");
  }
};
