/**
 * Utility functions for form validation and handling
 */

// Validate required fields
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

// Validate email format
export const validateEmail = (email) => {
  if (!email) return null; // Let validateRequired handle empty check
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

// Validate phone number format
export const validatePhone = (phone) => {
  if (!phone) return null; // Let validateRequired handle empty check
  
  // Simple phone validation - can be replaced with more complex region-specific validation
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Please enter a valid phone number';
  }
  return null;
};

// Validate numeric value
export const validateNumeric = (value, fieldName) => {
  if (value === '' || value === null || value === undefined) return null;
  
  if (isNaN(Number(value))) {
    return `${fieldName} must be a number`;
  }
  return null;
};

// Validate date range
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return null; // Let validateRequired handle empty check
  
  if (new Date(startDate) > new Date(endDate)) {
    return 'End date must be after start date';
  }
  return null;
};

// Format currency value
export const formatCurrency = (value) => {
  if (!value && value !== 0) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

// Format date string
export const formatDate = (dateString, format = 'full') => {
  const date = new Date(dateString);
  return format === 'full' ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : date.toLocaleDateString('en-US');
};