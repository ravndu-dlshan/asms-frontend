/**
 * Cookie utility functions for secure token management
 */

/**
 * Set a cookie with secure flags
 * @param name - Cookie name
 * @param value - Cookie value
 * @param maxAge - Maximum age in seconds (default: 1 hour)
 */
export const setCookie = (name: string, value: string, maxAge: number = 3600): void => {
  if (typeof document === 'undefined') return;
  
  const isProduction = process.env.NODE_ENV === 'production';
  const secure = isProduction ? 'secure;' : ''; // Only use secure in production (HTTPS)
  
  document.cookie = `${name}=${value}; path=/; ${secure} samesite=strict; max-age=${maxAge}`;
};

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
};

/**
 * Delete a cookie by name
 * @param name - Cookie name
 */
export const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

/**
 * Clear all auth-related cookies
 */
export const clearAuthCookies = (): void => {
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
  deleteCookie('authToken'); // Keep for backward compatibility
  deleteCookie('token');
  deleteCookie('userRole');
  deleteCookie('userInfo');
};

/**
 * Set user info in cookie
 * @param userInfo - User information object
 * @param maxAge - Maximum age in seconds (default: 1 hour)
 */
export const setUserInfo = (userInfo: { firstName: string; lastName: string; email: string; role: string }, maxAge: number = 3600): void => {
  setCookie('userInfo', JSON.stringify(userInfo), maxAge);
};

/**
 * Get user info from cookie
 * @returns User info object or null if not found
 */
export const getUserInfo = (): { firstName: string; lastName: string; email: string; role: string } | null => {
  const userInfoStr = getCookie('userInfo');
  if (!userInfoStr) return null;
  
  try {
    return JSON.parse(userInfoStr);
  } catch (error) {
    console.error('Error parsing user info from cookie:', error);
    return null;
  }
};
