import axios from 'axios';
const BASE_URL= process.env.NEXT_PUBLIC_BASE_URL;


//Register New User
export const registerUser= async (userData: {email: string, firstName: string, lastName: string, password : string, role:string})=>{
    try{
        const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
        return response.data;
    }catch(error){
        window.alert("Registration failed. Please try again.");
        console.log(error);
        return null;
    }
}

//SendOtp For Verification
export const sendOtp = async (otpCode:string)=>{
    try{
        const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`,  {otpCode} );
        return response.data;
    }catch(error){
        window.alert("OTP verification failed. Please try again.");
        return null;
    }
}

//Login User
export const loginUser = async (loginData: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData);

    const data = response.data;
    if (data?.token) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.role);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    }

    return data;
  } catch (error) {
    console.error("Login failed", error);
    return null;
  }
};
