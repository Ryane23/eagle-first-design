export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneCameroon = (phone: string): boolean => {
  // Format camerounais: commence par 6 ou 2, suivi de 8 chiffres
  const phoneRegex = /^(6|2)[0-9]{8}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return !value || value.length <= maxLength;
};

export const validateDateRange = (date: string, minDate?: string, maxDate?: string): boolean => {
  const dateObj = new Date(date);
  
  if (minDate) {
    const minDateObj = new Date(minDate);
    if (dateObj < minDateObj) return false;
  }
  
  if (maxDate) {
    const maxDateObj = new Date(maxDate);
    if (dateObj > maxDateObj) return false;
  }
  
  return true;
};

export const validateUrgencyLevel = (level: number): boolean => {
  return level >= 1 && level <= 5;
};