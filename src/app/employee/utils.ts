
export const formatTime = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(date));
};

export const formatTimeOnly = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(date));
};


export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount}`;
};

// ============================================
// SALARY & PAYMENT CALCULATIONS
// ============================================

export const calculateSalary = (
  hours: number,
  baseRate: number,
  overtimeRate: number,
  overtimeHours: number
): number => {
  const regularHours = hours - overtimeHours;
  return regularHours * baseRate + overtimeHours * overtimeRate;
};

export const calculateBonus = (
  baseAmount: number,
  bonusPercentage: number
): number => {
  return baseAmount * (bonusPercentage / 100);
};

export const calculateOvertimeHours = (totalHours: number, regularHours: number = 40): number => {
  return Math.max(0, totalHours - regularHours);
};

export const calculateOvertimePay = (overtimeHours: number, baseRate: number, multiplier: number = 1.5): number => {
  return overtimeHours * baseRate * multiplier;
};


export const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    delivered: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'in-progress': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    scheduled: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
    cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };
  return colors[status.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

export const getPriorityColor = (priority: string): string => {
  const colors: { [key: string]: string } = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    urgent: 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  return colors[priority.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

export const getStatusBadgeColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    pending: 'bg-yellow-500 text-white',
    approved: 'bg-green-500 text-white',
    rejected: 'bg-red-500 text-white',
    delivered: 'bg-blue-500 text-white',
    'in-progress': 'bg-orange-500 text-white',
    completed: 'bg-green-500 text-white',
    scheduled: 'bg-purple-500 text-white',
    overdue: 'bg-red-500 text-white'
  };
  return colors[status.toLowerCase()] || 'bg-gray-500 text-white';
};

// ============================================
// TIME OF DAY & GREETINGS
// ============================================

export const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export const getGreeting = (name: string): string => {
  const timeOfDay = getTimeOfDay();
  return `Good ${timeOfDay}, ${name}!`;
};

export const getTimeOfDayEmoji = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return '🌅';
  if (hour < 18) return '☀️';
  return '🌙';
};

// ============================================
// EFFICIENCY & PERFORMANCE CALCULATIONS
// ============================================

export const calculateEfficiency = (targetHours: number, actualHours: number): number => {
  if (actualHours === 0) return 0;
  return Math.round((targetHours / actualHours) * 100);
};

export const getEfficiencyStatus = (efficiency: number): {
  label: string;
  color: string;
} => {
  if (efficiency >= 95) return { label: 'Excellent', color: 'text-green-400' };
  if (efficiency >= 85) return { label: 'Good', color: 'text-blue-400' };
  if (efficiency >= 75) return { label: 'Average', color: 'text-yellow-400' };
  return { label: 'Needs Improvement', color: 'text-red-400' };
};

export const calculateCompletionRate = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const calculateAverageHoursPerJob = (totalHours: number, totalJobs: number): number => {
  if (totalJobs === 0) return 0;
  return Number((totalHours / totalJobs).toFixed(1));
};

// ============================================
// TEXT FORMATTING & MANIPULATION
// ============================================

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ');
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};


export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

export const groupBy = <T>(array: T[], key: keyof T): { [key: string]: T[] } => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as { [key: string]: T[] });
};

export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterBySearch = <T>(
  array: T[],
  searchTerm: string,
  searchKeys: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return array;
  
  const lowerSearch = searchTerm.toLowerCase();
  return array.filter(item =>
    searchKeys.some(key =>
      String(item[key]).toLowerCase().includes(lowerSearch)
    )
  );
};

export const getDaysAgo = (date: Date): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const getRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

export const isToday = (date: Date | string): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

export const isTomorrow = (date: Date | string): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === tomorrow.getDate() &&
    checkDate.getMonth() === tomorrow.getMonth() &&
    checkDate.getFullYear() === tomorrow.getFullYear()
  );
};

export const isThisWeek = (date: Date | string): boolean => {
  const now = new Date();
  const checkDate = new Date(date);
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
  return checkDate >= weekStart && checkDate <= weekEnd;
};

// ============================================
// NUMBER FORMATTING
// ============================================

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// ============================================
// LOCAL STORAGE HELPERS (Optional)
// ============================================

export const saveToLocalStorage = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  // Time
  formatTime,
  formatDate,
  formatDateTime,
  formatTimeOnly,
  
  // Currency
  formatCurrency,
  formatCurrencyCompact,
  
  // Calculations
  calculateSalary,
  calculateBonus,
  calculateEfficiency,
  calculateOvertimeHours,
  calculateOvertimePay,
  calculateCompletionRate,
  calculateAverageHoursPerJob,
  
  // Status & Colors
  getStatusColor,
  getPriorityColor,
  getStatusBadgeColor,
  getEfficiencyStatus,
  
  // Text
  truncateText,
  capitalizeFirst,
  capitalizeWords,
  slugify,
  
  // Time of Day
  getTimeOfDay,
  getGreeting,
  getTimeOfDayEmoji,
  
  // Utilities
  debounce,
  throttle,
  
  // Validation
  validateEmail,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  
  // Array Helpers
  groupBy,
  sortBy,
  filterBySearch,
  
  // Date Calculations
  getDaysAgo,
  getRelativeTime,
  isToday,
  isTomorrow,
  isThisWeek,
  
  // Numbers
  formatNumber,
  formatPercentage,
  clamp,
  
  // Local Storage
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage
};