import axios from 'axios';
const BASE_URL= process.env.NEXT_PUBLIC_BASE_URL;


//Register New User
export const registerUser= async (userData: {email: string, firstname: string, lastname: string, password : string, role:string})=>{
    try{
        const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
        return response.data;

    }catch(error){
        window.alert("Registration failed. Please try again.");
        return null;
    }
}

//SendOtp For Verification
export const sendOtp = async (otp:string)=>{
    try{
        const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { otp });
        return response.data;
    }catch(error){
        window.alert("OTP verification failed. Please try again.");
        return null;
    }
}

//Login User
export const loginUser = async (loginData: {email:string , password : string})=>{
    try{
        const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
        return response.data;
    }catch(error){
        window.alert("Login failed. Please try again.");
        return null;
    }
}
