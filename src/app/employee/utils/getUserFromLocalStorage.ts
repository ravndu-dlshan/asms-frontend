export const getUserFromLocalStorage = () => {
  try {
    console.log("Attempting to get userInfo from localStorage...");
    const userData = localStorage.getItem("userInfo");
    console.log("Raw userData from localStorage:", userData);

    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log("Parsed user data:", parsedUser);
      return parsedUser;
    } else {
      console.log("No userInfo found in localStorage");
      return null;
    }
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};
