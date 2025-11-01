import { getCookie } from "@/app/lib/cookies";

export const getUserFromStorage = () => {
  try {
    const userInfoStr = getCookie("userInfo");
    const token = getCookie("authToken");

    if (!userInfoStr || !token) {
      console.log("User info or token missing in cookies");
      return null;
    }

    const userInfo = JSON.parse(userInfoStr);

    const user = {
      firstName: userInfo.firstName || "",
      lastName: userInfo.lastName || "",
      email: userInfo.email || "",
      role: userInfo.role || "",
      token,
    };

    console.log("✅ User Loaded From Cookies:", user);
    return user;

  } catch (error) {
    console.error("❌ Error parsing user info from cookies:", error);
    return null;
  }
};
